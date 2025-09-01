<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApprovePasswordResetRequestRequest;
use App\Http\Requests\StorePasswordResetRequestRequest;
use App\Models\AuditLog;
use App\Models\PasswordResetRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PasswordResetRequestController extends Controller
{
    /**
     * Display a listing of password reset requests.
     */
    public function index()
    {
        $user = auth()->user();
        
        $query = PasswordResetRequest::with(['user', 'approver'])
            ->latest();
            
        // Lab assistants can only see requests from their laboratory users
        if ($user->isLabAssistant()) {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('laboratory_id', $user->laboratory_id);
            });
        }
        
        $requests = $query->paginate(15);
        
        return Inertia::render('password-reset-requests/index', [
            'requests' => $requests,
            'stats' => [
                'pending' => PasswordResetRequest::pending()->count(),
                'total' => PasswordResetRequest::count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new password reset request.
     */
    public function create()
    {
        return Inertia::render('password-reset-requests/create');
    }

    /**
     * Store a newly created password reset request.
     */
    public function store(StorePasswordResetRequestRequest $request)
    {
        $user = User::where('email', $request->email)->first();
        
        // Check for existing pending request
        $existingRequest = PasswordResetRequest::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->first();
            
        if ($existingRequest) {
            return back()->withErrors([
                'email' => 'You already have a pending password reset request.'
            ]);
        }
        
        $passwordResetRequest = PasswordResetRequest::create([
            'user_id' => $user->id,
            'token' => PasswordResetRequest::generateToken(),
            'status' => 'pending',
            'requester_notes' => $request->requester_notes,
            'expires_at' => now()->addDays(7),
        ]);
        
        // Log the action
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'password_reset_request_created',
            'auditable_type' => PasswordResetRequest::class,
            'auditable_id' => $passwordResetRequest->id,
            'old_values' => null,
            'new_values' => [
                'request_id' => $passwordResetRequest->id,
                'requester_notes' => $request->requester_notes,
            ],
        ]);
        
        return redirect()->route('login')
            ->with('success', 'Password reset request submitted successfully. An administrator will review your request.');
    }

    /**
     * Display the specified password reset request.
     */
    public function show(PasswordResetRequest $passwordResetRequest)
    {
        $user = auth()->user();
        
        // Check authorization for lab assistants
        if ($user->isLabAssistant() && $passwordResetRequest->user->laboratory_id !== $user->laboratory_id) {
            abort(403, 'You can only view requests from users in your laboratory.');
        }
        
        $passwordResetRequest->load(['user.laboratory', 'approver']);
        
        return Inertia::render('password-reset-requests/show', [
            'request' => $passwordResetRequest,
        ]);
    }

    /**
     * Update the specified password reset request (approve/reject).
     */
    public function update(ApprovePasswordResetRequestRequest $request, PasswordResetRequest $passwordResetRequest)
    {
        $user = auth()->user();
        
        // Check authorization for lab assistants
        if ($user->isLabAssistant() && $passwordResetRequest->user->laboratory_id !== $user->laboratory_id) {
            abort(403, 'You can only manage requests from users in your laboratory.');
        }
        
        if (!$passwordResetRequest->isPending()) {
            return back()->withErrors([
                'request' => 'This request has already been processed.'
            ]);
        }
        
        if ($passwordResetRequest->isExpired()) {
            return back()->withErrors([
                'request' => 'This request has expired.'
            ]);
        }
        
        $oldValues = $passwordResetRequest->toArray();
        
        if ($request->action === 'approve') {
            $temporaryPassword = PasswordResetRequest::generateTemporaryPassword();
            
            // Update the password reset request
            $passwordResetRequest->update([
                'status' => 'completed',
                'approver_id' => $user->id,
                'approval_notes' => $request->approval_notes,
                'temporary_password' => Hash::make($temporaryPassword),
            ]);
            
            // Update the user's password and force password change
            $passwordResetRequest->user->update([
                'password' => Hash::make($temporaryPassword),
                'force_password_change_on_next_login' => true,
            ]);
            
            // Log the approval
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'password_reset_approved',
                'auditable_type' => PasswordResetRequest::class,
                'auditable_id' => $passwordResetRequest->id,
                'old_values' => $oldValues,
                'new_values' => [
                    'status' => 'completed',
                    'approver_id' => $user->id,
                    'approval_notes' => $request->approval_notes,
                    'temporary_password_set' => true,
                ],
            ]);
            
            // Log password change
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'temporary_password_set',
                'auditable_type' => User::class,
                'auditable_id' => $passwordResetRequest->user->id,
                'old_values' => null,
                'new_values' => [
                    'temporary_password' => $temporaryPassword, // Store plain text for admin reference
                    'force_password_change' => true,
                ],
            ]);
            
            $message = "Password reset request approved. Temporary password: {$temporaryPassword}";
            
        } else {
            // Reject the request
            $passwordResetRequest->update([
                'status' => 'rejected',
                'approver_id' => $user->id,
                'approval_notes' => $request->approval_notes,
            ]);
            
            // Log the rejection
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'password_reset_rejected',
                'auditable_type' => PasswordResetRequest::class,
                'auditable_id' => $passwordResetRequest->id,
                'old_values' => $oldValues,
                'new_values' => [
                    'status' => 'rejected',
                    'approver_id' => $user->id,
                    'approval_notes' => $request->approval_notes,
                ],
            ]);
            
            $message = 'Password reset request rejected.';
        }
        
        return redirect()->route('password-reset-requests.index')
            ->with('success', $message);
    }
}