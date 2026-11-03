<?php

namespace Tests\Feature;

use App\Enums\ReportStatus;
use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminWasteReportStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_report_status_and_creates_history(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->user()->create();
        $report = WasteReport::factory()->pending()->create(['user_id' => $user->id]);

        $response = $this->actingAs($admin)->patchJson("/api/admin/waste-reports/{$report->id}/status", [
            'status' => 'in_progress',
            'note' => 'Petugas telah dikerahkan.',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Report status updated successfully.',
                'data' => [
                    'id' => $report->id,
                    'status' => 'in_progress',
                ],
            ]);

        $report->refresh();
        $this->assertEquals(ReportStatus::IN_PROGRESS, $report->status);

        $this->assertDatabaseHas('report_status_histories', [
            'waste_report_id' => $report->id,
            'changed_by' => $admin->id,
            'old_status' => 'pending',
            'new_status' => 'in_progress',
            'note' => 'Petugas telah dikerahkan.',
        ]);
    }

    public function test_user_cannot_update_report_status(): void
    {
        $user = User::factory()->user()->create();
        $report = WasteReport::factory()->pending()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->patchJson("/api/admin/waste-reports/{$report->id}/status", [
            'status' => 'completed',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ]);
    }
}

