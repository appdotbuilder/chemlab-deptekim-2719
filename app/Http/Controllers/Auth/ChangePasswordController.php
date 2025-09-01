<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ChangePasswordController extends Controller
{
    /**
     * Show the form for changing password.
     */
    public function show()
    {
        $user = auth()->user();
        
        return Inertia::render('auth/change-password', [
            'mustChangePassword' => $user->mustChangePassword(),
        ]);
    }

    /**
     * Handle password change request.
     */
    public function store(ChangePasswordRequest $request)
    {
        $user = auth()->user();
        $forceChange = $user->mustChangePassword();
        
        // For forced password changes, we don't require current password validation
        if ($forceChange) {
            $request->merge(['force_change' => true]);
        }
        
        // Update the password
        $user->update([
            'password' => Hash::make($request->password),
            'force_password_change_on_next_login' => false,
        ]);
        
        // Log the action
        AuditLog::create([
            'user_id' => $user->id,
            'action' => $forceChange ? 'forced_password_changed' : 'password_changed',
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'old_values' => [
                'force_password_change_on_next_login' => $forceChange,
            ],
            'new_values' => [
                'password_changed' => true,
                'force_password_change_on_next_login' => false,
            ],
        ]);
        
        $message = $forceChange 
            ? 'Your temporary password has been changed successfully. You can now access the application.'
            : 'Password changed successfully.';
        
        return redirect()->route('dashboard')
            ->with('success', $message);
    }
}