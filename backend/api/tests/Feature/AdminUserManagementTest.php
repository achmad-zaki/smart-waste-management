<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_users_with_reports_count(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->user()->create(['name' => 'Budi Santoso']);
        WasteReport::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($admin)->getJson('/api/admin/users?search=Budi');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    [
                        'id' => $user->id,
                        'name' => 'Budi Santoso',
                        'reports_count' => 1,
                    ],
                ],
                'meta' => [
                    'current_page' => 1,
                    'per_page' => 10,
                ],
            ]);
    }

    public function test_admin_can_view_user_detail(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->user()->create(['name' => 'Siti Aminah']);

        $response = $this->actingAs($admin)->getJson("/api/admin/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => 'Siti Aminah',
                ],
            ]);
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'user',
            'phone' => '081299998888',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'User created successfully.',
                'data' => [
                    'email' => 'newuser@example.com',
                    'role' => 'user',
                    'phone' => '081299998888',
                ],
            ]);

        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
    }

    public function test_admin_can_update_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->user()->create();

        $response = $this->actingAs($admin)->putJson("/api/admin/users/{$user->id}", [
            'name' => 'Updated Name',
            'phone' => '081122334455',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User updated successfully.',
                'data' => [
                    'name' => 'Updated Name',
                    'phone' => '081122334455',
                ],
            ]);
    }

    public function test_admin_cannot_demote_last_admin(): void
    {
        $soleAdmin = User::factory()->admin()->create();

        $response = $this->actingAs($soleAdmin)->putJson("/api/admin/users/{$soleAdmin->id}", [
            'role' => 'user',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Cannot demote the last remaining administrator.',
            ]);
    }

    public function test_admin_cannot_delete_own_account(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->deleteJson("/api/admin/users/{$admin->id}");

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'You cannot delete your own account.',
            ]);
    }

    public function test_admin_cannot_delete_last_admin(): void
    {
        $admin1 = User::factory()->admin()->create();
        $admin2 = User::factory()->admin()->create();

        // admin1 can delete admin2 because there are 2 admins
        $this->actingAs($admin1)->deleteJson("/api/admin/users/{$admin2->id}")
            ->assertStatus(200);

        // Now admin1 is the only admin; cannot be deleted by self or anyone
        $anotherUserActing = User::factory()->user()->create();
        $this->actingAs($anotherUserActing)->deleteJson("/api/admin/users/{$admin1->id}")
            ->assertStatus(403);
    }

    public function test_admin_cannot_delete_user_with_reports(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->user()->create();
        WasteReport::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($admin)->deleteJson("/api/admin/users/{$user->id}");

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Cannot delete user with existing waste reports.',
            ]);
    }

    public function test_regular_user_cannot_access_admin_users_api(): void
    {
        $user = User::factory()->user()->create();

        $response = $this->actingAs($user)->getJson('/api/admin/users');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ]);
    }
}
