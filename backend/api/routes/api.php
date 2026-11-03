<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminWasteReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\WasteReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth management
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Profile management
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    // Waste reports
    Route::post('/waste-reports/classify', [WasteReportController::class, 'classify']);
    Route::get('/waste-reports', [WasteReportController::class, 'index']);
    Route::post('/waste-reports', [WasteReportController::class, 'store']);
    Route::get('/waste-reports/{wasteReport}', [WasteReportController::class, 'show']);
    Route::put('/waste-reports/{wasteReport}', [WasteReportController::class, 'update']);
    Route::delete('/waste-reports/{wasteReport}', [WasteReportController::class, 'destroy']);

    // Admin routes
    Route::prefix('admin')
        ->middleware('role:admin')
        ->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);
            Route::apiResource('users', AdminUserController::class);
            Route::patch('/waste-reports/{wasteReport}/status', [AdminWasteReportController::class, 'updateStatus']);
        });

    // User routes
    Route::prefix('user')
        ->middleware('role:user')
        ->group(function () {
            Route::get('/dashboard', [UserDashboardController::class, 'index']);
        });
});
