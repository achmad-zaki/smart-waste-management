<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AdminUserController extends Controller
{
    use ApiResponse;

    /**
     * Display a paginated listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::withCount('wasteReports');

        if ($request->filled('search')) {
            $searchTerm = '%'.$request->search.'%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                    ->orWhere('email', 'like', $searchTerm);
            });
        }

        if ($request->filled('role') && in_array($request->role, array_column(UserRole::cases(), 'value'), true)) {
            $query->where('role', $request->role);
        }

        $perPage = max(1, min((int) $request->input('per_page', 10), 100));
        $paginator = $query->latest('id')->paginate($perPage);

        return $this->paginatedResponse($paginator, fn ($user) => (new UserResource($user))->resolve());
    }

    /**
     * Display the specified user detail.
     */
    public function show(User $user): JsonResponse
    {
        $user->loadCount('wasteReports');

        return $this->successResponse(new UserResource($user));
    }

    /**
     * Create a new user (admin or regular user).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::min(8), 'confirmed'],
            'role' => ['required', 'string', Rule::in(array_column(UserRole::cases(), 'value'))],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
        ]);

        return $this->createdResponse(new UserResource($user), 'User created successfully.');
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['sometimes', 'required', 'string', Rule::in(array_column(UserRole::cases(), 'value'))],
        ]);

        // Prevent demoting the last remaining admin
        if (isset($validated['role']) && $user->isAdmin() && $validated['role'] === UserRole::USER->value) {
            $adminCount = User::where('role', UserRole::ADMIN->value)->count();
            if ($adminCount <= 1) {
                return $this->errorResponse('Cannot demote the last remaining administrator.', 422);
            }
        }

        $user->update($validated);

        return $this->successResponse(new UserResource($user), 'User updated successfully.');
    }

    /**
     * Delete the specified user.
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        // Prevent deleting own account
        if ($request->user()->id === $user->id) {
            return $this->errorResponse('You cannot delete your own account.', 422);
        }

        // Prevent deleting the last remaining admin
        if ($user->isAdmin()) {
            $adminCount = User::where('role', UserRole::ADMIN->value)->count();
            if ($adminCount <= 1) {
                return $this->errorResponse('Cannot delete the last remaining administrator.', 422);
            }
        }

        // Check if user has waste reports (foreign key restrict rule)
        if ($user->wasteReports()->exists()) {
            return $this->errorResponse('Cannot delete user with existing waste reports.', 422);
        }

        $user->delete();

        return $this->successResponse(null, 'User deleted successfully.');
    }
}
