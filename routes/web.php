<?php

use App\Http\Controllers\Auth\ChangePasswordController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\LoanRequestController;
use App\Http\Controllers\PasswordResetRequestController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Password reset request routes (public)
Route::get('/password-reset-request', [PasswordResetRequestController::class, 'create'])
    ->name('password-reset-request.create');
Route::post('/password-reset-request', [PasswordResetRequestController::class, 'store'])
    ->name('password-reset-request.store');

// Password change routes (authenticated users)
Route::middleware(['auth'])->group(function () {
    Route::get('/change-password', [ChangePasswordController::class, 'show'])
        ->name('password.change');
    Route::post('/change-password', [ChangePasswordController::class, 'store'])
        ->name('password.update');
});

Route::middleware(['auth', 'verified', App\Http\Middleware\EnsurePasswordChanged::class])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Equipment management
    Route::resource('equipment', EquipmentController::class);
    
    // Laboratory management (admin only)
    Route::resource('laboratories', LaboratoryController::class);
    
    // Loan requests
    Route::resource('loan-requests', LoanRequestController::class);
    
    // User management (admin and lab assistant only)
    Route::middleware(['can:manage-users'])->group(function () {
        Route::resource('users', UserManagementController::class)->except(['destroy']);
        Route::patch('/users/{user}/status', [\App\Http\Controllers\UserStatusController::class, 'update'])
            ->name('users.update-status');
        Route::get('/users-pending-verification', [\App\Http\Controllers\PendingVerificationController::class, 'index'])
            ->name('users.pending-verification');
    });
    
    // Password reset request management (admin and lab assistant only)
    Route::middleware(['can:approve-password-resets'])->group(function () {
        Route::resource('password-reset-requests', PasswordResetRequestController::class)
            ->only(['index', 'show', 'update']);
    });
    
    // Quick actions for equipment browsing (for students)
    Route::get('/browse-equipment', [EquipmentController::class, 'index'])
        ->name('equipment.browse');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';