<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_profile_returns_user_data(): void
    {
        $user = User::factory()->create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'phone' => '081234567890',
        ]);

        $response = $this->actingAs($user)->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => 'Budi Santoso',
                    'email' => 'budi@example.com',
                    'phone' => '081234567890',
                ],
            ]);
    }

    public function test_update_profile_updates_name_and_phone(): void
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'budi@example.com',
            'phone' => null,
        ]);

        $response = $this->actingAs($user)->putJson('/api/profile', [
            'name' => 'Budi Santoso',
            'phone' => '081234567890',
            'email' => 'hacked@example.com', // Should not be modified
            'role' => 'admin', // Should not be modified
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Profile updated successfully.',
                'data' => [
                    'name' => 'Budi Santoso',
                    'phone' => '081234567890',
                    'email' => 'budi@example.com',
                ],
            ]);

        $user->refresh();
        $this->assertEquals('Budi Santoso', $user->name);
        $this->assertEquals('081234567890', $user->phone);
        $this->assertEquals('budi@example.com', $user->email);
        $this->assertFalse($user->isAdmin());
    }

    public function test_change_password_with_valid_current_password(): void
    {
        $user = User::factory()->create([
            'password' => 'old-password123',
        ]);

        $response = $this->actingAs($user)->putJson('/api/profile/password', [
            'current_password' => 'old-password123',
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Password updated successfully.',
            ]);

        $user->refresh();
        $this->assertTrue(Hash::check('new-password123', $user->password));
    }

    public function test_change_password_fails_with_invalid_current_password(): void
    {
        $user = User::factory()->create([
            'password' => 'old-password123',
        ]);

        $response = $this->actingAs($user)->putJson('/api/profile/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }
}

