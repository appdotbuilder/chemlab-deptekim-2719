<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\LaboratoryController;
use App\Http\Controllers\LoanRequestController;
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

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Equipment management
    Route::resource('equipment', EquipmentController::class);
    
    // Laboratory management (admin only)
    Route::resource('laboratories', LaboratoryController::class);
    
    // Loan requests
    Route::resource('loan-requests', LoanRequestController::class);
    
    // Quick actions for equipment browsing (for students)
    Route::get('/browse-equipment', [EquipmentController::class, 'index'])
        ->name('equipment.browse');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';