<?php

namespace Tests\Feature;

use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Enums\WasteCategory;
use App\Models\ReportStatusHistory;
use App\Models\User;
use App\Models\WasteReport;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class DatabaseDesignTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_tables_exist(): void
    {
        $this->assertTrue(Schema::hasTable('users'));
        $this->assertTrue(Schema::hasTable('waste_reports'));
        $this->assertTrue(Schema::hasTable('report_status_histories'));
        $this->assertTrue(Schema::hasTable('personal_access_tokens'));
    }

    public function test_users_table_has_expected_columns(): void
    {
        $columns = [
            'id',
            'name',
            'email',
            'password',
            'role',
            'phone',
            'email_verified_at',
            'remember_token',
            'created_at',
            'updated_at',
        ];

        foreach ($columns as $column) {
            $this->assertTrue(
                Schema::hasColumn('users', $column),
                "Column [{$column}] does not exist on users table."
            );
        }
    }

    public function test_waste_reports_table_has_expected_columns(): void
    {
        $columns = [
            'id',
            'user_id',
            'title',
            'description',
            'image_url',
            'waste_category',
            'confidence_score',
            'latitude',
            'longitude',
            'address',
            'status',
            'created_at',
            'updated_at',
        ];

        foreach ($columns as $column) {
            $this->assertTrue(
                Schema::hasColumn('waste_reports', $column),
                "Column [{$column}] does not exist on waste_reports table."
            );
        }
    }

    public function test_report_status_histories_table_has_expected_columns(): void
    {
        $columns = [
            'id',
            'waste_report_id',
            'changed_by',
            'old_status',
            'new_status',
            'note',
            'created_at',
        ];

        foreach ($columns as $column) {
            $this->assertTrue(
                Schema::hasColumn('report_status_histories', $column),
                "Column [{$column}] does not exist on report_status_histories table."
            );
        }

        // report_status_histories does NOT have updated_at
        $this->assertFalse(Schema::hasColumn('report_status_histories', 'updated_at'));
    }

    public function test_user_roles_and_helpers(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->user()->create();

        $this->assertEquals(UserRole::ADMIN, $admin->role);
        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($admin->isUser());

        $this->assertEquals(UserRole::USER, $user->role);
        $this->assertTrue($user->isUser());
        $this->assertFalse($user->isAdmin());
    }

    public function test_sanctum_api_token_creation(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token');

        $this->assertNotEmpty($token->plainTextToken);
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->id,
            'name' => 'test-token',
        ]);
    }

    public function test_waste_report_creation_and_casts(): void
    {
        $user = User::factory()->create();

        $report = WasteReport::create([
            'user_id' => $user->id,
            'title' => 'Tumpukan Sampah Plastik',
            'description' => 'Sampah plastik menumpuk di tepi jalan.',
            'image_url' => 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            'waste_category' => WasteCategory::PLASTIC->value,
            'confidence_score' => 0.9523,
            'latitude' => -6.1234567,
            'longitude' => 106.7654321,
            'address' => 'Jl. Merdeka No. 10',
            'status' => ReportStatus::PENDING->value,
        ]);

        $this->assertEquals(WasteCategory::PLASTIC, $report->waste_category);
        $this->assertEquals(ReportStatus::PENDING, $report->status);
        $this->assertEquals(0.9523, $report->confidence_score);
        $this->assertEquals(-6.1234567, $report->latitude);
        $this->assertEquals(106.7654321, $report->longitude);
        $this->assertTrue($report->canBeModifiedByUser());

        $report->status = ReportStatus::IN_PROGRESS;
        $report->save();

        $this->assertFalse($report->canBeModifiedByUser());
    }

    public function test_report_status_history_cascade_delete_on_report_deletion(): void
    {
        $user = User::factory()->create();
        $admin = User::factory()->admin()->create();

        $report = WasteReport::factory()->create(['user_id' => $user->id]);

        $history1 = ReportStatusHistory::factory()->initial()->create([
            'waste_report_id' => $report->id,
            'changed_by' => null,
        ]);

        $history2 = ReportStatusHistory::create([
            'waste_report_id' => $report->id,
            'changed_by' => $admin->id,
            'old_status' => ReportStatus::PENDING->value,
            'new_status' => ReportStatus::IN_PROGRESS->value,
            'note' => 'Penanganan dimulai',
            'created_at' => now(),
        ]);

        $this->assertCount(2, $report->statusHistories);

        // Deleting the report should cascade delete status histories
        $report->delete();

        $this->assertDatabaseMissing('waste_reports', ['id' => $report->id]);
        $this->assertDatabaseMissing('report_status_histories', ['id' => $history1->id]);
        $this->assertDatabaseMissing('report_status_histories', ['id' => $history2->id]);
    }

    public function test_report_status_history_changed_by_set_null_on_user_deletion(): void
    {
        $user = User::factory()->create();
        $admin = User::factory()->admin()->create();

        $report = WasteReport::factory()->create(['user_id' => $user->id]);

        $history = ReportStatusHistory::create([
            'waste_report_id' => $report->id,
            'changed_by' => $admin->id,
            'old_status' => ReportStatus::PENDING->value,
            'new_status' => ReportStatus::COMPLETED->value,
            'note' => 'Selesai ditangani',
            'created_at' => now(),
        ]);

        $this->assertEquals($admin->id, $history->changed_by);

        // Deleting the admin should set changed_by to NULL
        $admin->delete();

        $history->refresh();
        $this->assertNull($history->changed_by);
    }

    public function test_database_seeder_populates_data(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@smartwaste.local',
            'role' => UserRole::ADMIN->value,
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'user@smartwaste.local',
            'role' => UserRole::USER->value,
        ]);

        $this->assertDatabaseCount('waste_reports', 2);
        $this->assertDatabaseCount('report_status_histories', 3);
    }
}
