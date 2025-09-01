<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:'.User::class,
                'regex:/^[a-zA-Z0-9._%+-]+@ui\.ac\.id$/', // Only allow @ui.ac.id for self-registration
            ],
            'password' => [
                'required',
                'confirmed',
                Rules\Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers(),
            ],
            'student_id' => 'nullable|string|max:20|unique:users,student_id',
            'phone' => 'nullable|string|max:20',
        ], [
            'email.regex' => 'Students must use @ui.ac.id email domain for registration.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.letters' => 'Password must contain letters.',
            'password.mixed' => 'Password must contain both uppercase and lowercase letters.',
            'password.numbers' => 'Password must contain numbers.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student', // Self-registered users are always students
            'status' => 'pending_verification', // Require verification
            'student_id' => $request->student_id,
            'phone' => $request->phone,
        ]);

        // Log the registration
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'user_self_registered',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'old_values' => null,
            'new_values' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
            ],
        ]);

        event(new Registered($user));

        // Don't auto-login for pending verification users
        return redirect()->route('login')
            ->with('success', 'Registration successful! Your account is pending verification. An administrator will review and activate your account.');
    }
}