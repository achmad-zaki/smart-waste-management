<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WasteReportApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_waste_report_with_image_and_initial_history(): void
    {
        Storage::fake('public');

        $user = User::factory()->user()->create();
        $file = UploadedFile::fake()->image('waste.jpg', 640, 480);

        $response = $this->actingAs($user)->postJson('/api/waste-reports', [
            'title' => 'Sampah botol plastik',
            'description' => 'Banyak botol plastik di pinggir jalan.',
            'image' => $file,
            'waste_category' => 'plastic',
            'confidence_score' => 0.9421,
            'latitude' => -6.2000000,
            'longitude' => 106.8166667,
            'address' => 'Jl. Thamrin',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Report created successfully.',
                'data' => [
                    'title' => 'Sampah botol plastik',
                    'waste_category' => 'plastic',
                    'confidence_score' => 0.9421,
                    'status' => 'pending',
                ],
            ]);

        $reportId = $response->json('data.id');

        $this->assertDatabaseHas('waste_reports', [
            'id' => $reportId,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('report_status_histories', [
            'waste_report_id' => $reportId,
            'old_status' => null,
            'new_status' => 'pending',
        ]);
    }

    public function test_admin_cannot_create_waste_report(): void
    {
        Storage::fake('public');

        $admin = User::factory()->admin()->create();
        $file = UploadedFile::fake()->image('waste.jpg');

        $response = $this->actingAs($admin)->postJson('/api/waste-reports', [
            'title' => 'Sampah botol',
            'description' => 'Deskripsi',
            'image' => $file,
            'waste_category' => 'plastic',
            'latitude' => -6.2,
            'longitude' => 106.8,
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ]);
    }

    public function test_list_reports_shows_all_for_admin_and_own_only_for_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user1 = User::factory()->user()->create();
        $user2 = User::factory()->user()->create();

        WasteReport::factory()->create(['user_id' => $user1->id, 'title' => 'Report 1']);
        WasteReport::factory()->create(['user_id' => $user2->id, 'title' => 'Report 2']);

        // User 1 sees only Report 1
        $userResponse = $this->actingAs($user1)->getJson('/api/waste-reports');
        $userResponse->assertStatus(200);
        $this->assertCount(1, $userResponse->json('data'));
        $this->assertEquals('Report 1', $userResponse->json('data.0.title'));

        // Admin sees both reports
        $adminResponse = $this->actingAs($admin)->getJson('/api/waste-reports');
        $adminResponse->assertStatus(200);
        $this->assertCount(2, $adminResponse->json('data'));
    }

    public function test_show_report_authorizations(): void
    {
        $admin = User::factory()->admin()->create();
        $owner = User::factory()->user()->create();
        $otherUser = User::factory()->user()->create();

        $report = WasteReport::factory()->create(['user_id' => $owner->id]);

        // Owner can view
        $this->actingAs($owner)->getJson("/api/waste-reports/{$report->id}")
            ->assertStatus(200)
            ->assertJson(['success' => true, 'data' => ['id' => $report->id]]);

        // Admin can view
        $this->actingAs($admin)->getJson("/api/waste-reports/{$report->id}")
            ->assertStatus(200)
            ->assertJson(['success' => true, 'data' => ['id' => $report->id]]);

        // Other user is forbidden
        $this->actingAs($otherUser)->getJson("/api/waste-reports/{$report->id}")
            ->assertStatus(403);
    }

    public function test_user_can_update_own_pending_report_but_not_in_progress(): void
    {
        $owner = User::factory()->user()->create();

        $pendingReport = WasteReport::factory()->pending()->create(['user_id' => $owner->id]);
        $inProgressReport = WasteReport::factory()->inProgress()->create(['user_id' => $owner->id]);

        // Can update pending
        $this->actingAs($owner)->putJson("/api/waste-reports/{$pendingReport->id}", [
            'title' => 'Updated Title',
        ])->assertStatus(200)->assertJson([
            'success' => true,
            'data' => ['title' => 'Updated Title'],
        ]);

        // Cannot update in_progress
        $this->actingAs($owner)->putJson("/api/waste-reports/{$inProgressReport->id}", [
            'title' => 'Updated Title',
        ])->assertStatus(403);
    }

    public function test_admin_can_update_any_report(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->user()->create();
        $report = WasteReport::factory()->inProgress()->create(['user_id' => $user->id]);

        $this->actingAs($admin)->putJson("/api/waste-reports/{$report->id}", [
            'title' => 'Admin Updated Title',
        ])->assertStatus(200)->assertJson([
            'success' => true,
            'data' => ['title' => 'Admin Updated Title'],
        ]);
    }

    public function test_user_can_delete_own_pending_report_but_not_completed(): void
    {
        $owner = User::factory()->user()->create();

        $pendingReport = WasteReport::factory()->pending()->create(['user_id' => $owner->id]);
        $completedReport = WasteReport::factory()->completed()->create(['user_id' => $owner->id]);

        // Can delete pending
        $this->actingAs($owner)->deleteJson("/api/waste-reports/{$pendingReport->id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('waste_reports', ['id' => $pendingReport->id]);

        // Cannot delete completed
        $this->actingAs($owner)->deleteJson("/api/waste-reports/{$completedReport->id}")
            ->assertStatus(403);
    }

    public function test_classify_image_success_with_fastapi_mock(): void
    {
        Http::fake([
            '*/predict' => Http::response([
                'success' => true,
                'prediction' => [
                    'category' => 'plastic',
                    'confidence' => 0.94,
                ],
            ], 200),
        ]);

        $user = User::factory()->user()->create();
        $file = UploadedFile::fake()->image('bottle.jpg');

        $response = $this->actingAs($user)->postJson('/api/waste-reports/classify', [
            'image' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Image classified successfully.',
                'data' => [
                    'predicted_category' => 'plastic',
                    'confidence_score' => 0.94,
                ],
            ]);
    }

    public function test_classify_image_returns_503_when_fastapi_is_down(): void
    {
        Http::fake([
            '*/predict' => Http::response('Server Error', 500),
        ]);

        $user = User::factory()->user()->create();
        $file = UploadedFile::fake()->image('bottle.jpg');

        $response = $this->actingAs($user)->postJson('/api/waste-reports/classify', [
            'image' => $file,
        ]);

        $response->assertStatus(503)
            ->assertJson([
                'success' => false,
                'message' => 'Machine learning service is currently unavailable.',
            ]);
    }
}
