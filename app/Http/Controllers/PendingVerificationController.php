<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class PendingVerificationController extends Controller
{
    /**
     * Display users pending verification.
     */
    public function index()
    {
        $user = auth()->user();
        
        $query = User::with('laboratory')->pendingVerification()->latest();
        
        // Lab assistants can only see pending users from their laboratory or unassigned
        if ($user->isLabAssistant()) {
            $query->where(function ($q) use ($user) {
                $q->whereNull('laboratory_id')
                  ->orWhere('laboratory_id', $user->laboratory_id);
            });
        }
        
        $pendingUsers = $query->paginate(15);
        
        return Inertia::render('users/pending-verification', [
            'users' => $pendingUsers,
            'userLaboratory' => $user->laboratory,
        ]);
    }
}