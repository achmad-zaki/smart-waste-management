<?php

namespace Tests\Feature;

use App\Enums\ReportStatus;
use App\Enums\WasteCategory;
use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_returns_all_statistics_for_admin(): void
    {
        $admin = User::factory()->admin()->create();
        $user1 = User::factory()->user()->create();
        $user2 = User::factory()->user()->create();

        WasteReport::factory()->create([
            'user_id' => $user1->id,
            'status' => ReportStatus::PENDING->value,
            'waste_category' => WasteCategory::ORGANIC->value,
        ]);
        WasteReport::factory()->create([
            'user_id' => $user2->id,
            'status' => ReportStatus::COMPLETED->value,
            'waste_category' => WasteCategory::PLASTIC->value,
        ]);

        $response = $this->actingAs($admin)->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_reports' => 2,
                    'pending_reports' => 1,
                    'completed_reports' => 1,
                    'reports_by_category' => [
                        'organic' => 1,
                        'plastic' => 1,
                        'paper' => 0,
                    ],
                ],
            ]);
    }

    public function test_admin_dashboard_is_forbidden_for_regular_user(): void
    {
        $user = User::factory()->user()->create();

        $response = $this->actingAs($user)->getJson('/api/admin/dashboard');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ]);
    }

    public function test_user_dashboard_returns_only_own_statistics(): void
    {
        $user1 = User::factory()->user()->create();
        $user2 = User::factory()->user()->create();

        WasteReport::factory()->create([
            'user_id' => $user1->id,
            'status' => ReportStatus::PENDING->value,
        ]);
        WasteReport::factory()->create([
            'user_id' => $user1->id,
            'status' => ReportStatus::COMPLETED->value,
        ]);
        // User 2's report should NOT count
        WasteReport::factory()->create([
            'user_id' => $user2->id,
            'status' => ReportStatus::PENDING->value,
        ]);

        $response = $this->actingAs($user1)->getJson('/api/user/dashboard');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_reports' => 2,
                    'pending_reports' => 1,
                    'completed_reports' => 1,
                ],
            ]);
    }

    public function test_user_dashboard_is_forbidden_for_admin(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->getJson('/api/user/dashboard');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ]);
    }
}

