<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => false, // Disable default password reset
            'canRequestPasswordReset' => true, // Enable our custom password reset request
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        
        $user = Auth::user();
        
        // Check if user is inactive
        if ($user->status === 'inactive') {
            Auth::logout();
            return back()->withErrors([
                'email' => 'Your account has been deactivated. Please contact an administrator.',
            ]);
        }
        
        // Check if user is pending verification
        if ($user->status === 'pending_verification') {
            Auth::logout();
            return back()->withErrors([
                'email' => 'Your account is pending verification. Please wait for an administrator to activate your account.',
            ]);
        }

        $request->session()->regenerate();
        
        // Log successful login
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'user_logged_in',
            'auditable_type' => get_class($user),
            'auditable_id' => $user->id,
            'old_values' => null,
            'new_values' => [
                'login_time' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ],
        ]);

        // Check if user must change password
        if ($user->mustChangePassword()) {
            return redirect()->route('password.change')
                ->with('warning', 'You must change your temporary password before continuing.');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();
        
        if ($user) {
            // Log logout
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'user_logged_out',
                'auditable_type' => get_class($user),
                'auditable_id' => $user->id,
                'old_values' => null,
                'new_values' => [
                    'logout_time' => now(),
                    'ip_address' => $request->ip(),
                ],
            ]);
        }
        
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}