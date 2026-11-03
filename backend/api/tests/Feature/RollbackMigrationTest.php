<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class RollbackMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_migrations_can_rollback_and_remigrate(): void
    {
        $this->artisan('migrate:rollback')->assertExitCode(0);
        $this->assertFalse(Schema::hasTable('report_status_histories'));
        $this->assertFalse(Schema::hasTable('waste_reports'));
        $this->assertFalse(Schema::hasTable('personal_access_tokens'));

        $this->artisan('migrate')->assertExitCode(0);
        $this->assertTrue(Schema::hasTable('waste_reports'));
        $this->assertTrue(Schema::hasTable('report_status_histories'));
        $this->assertTrue(Schema::hasTable('personal_access_tokens'));
    }
}
