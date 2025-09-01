<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;

use App\Models\AuditLog;
use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $user = auth()->user();
        
        $query = User::with('laboratory')->latest();
        
        // Lab assistants can only see users from their laboratory
        if ($user->isLabAssistant()) {
            $query->where(function ($q) use ($user) {
                $q->where('laboratory_id', $user->laboratory_id)
                  ->orWhere('id', $user->id); // Include themselves
            });
        }
        
        $users = $query->paginate(15);
        
        $stats = [
            'total' => User::count(),
            'active' => User::active()->count(),
            'pending' => User::pendingVerification()->count(),
            'by_role' => User::selectRaw('role, count(*) as count')
                ->groupBy('role')
                ->pluck('count', 'role')
                ->toArray(),
        ];
        
        return Inertia::render('users/index', [
            'users' => $users,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $user = auth()->user();
        
        $laboratories = Laboratory::all();
        
        // Determine available roles based on user permissions
        $availableRoles = [];
        if ($user->isAdmin()) {
            $availableRoles = [
                'student' => 'Student',
                'lab_assistant' => 'Lab Assistant',
                'kepala_lab' => 'Head of Lab',
                'dosen' => 'Lecturer',
                'admin' => 'Administrator',
            ];
        } elseif ($user->isLabAssistant()) {
            $availableRoles = [
                'student' => 'Student',
            ];
            // Filter laboratories to only the user's laboratory
            $laboratories = $laboratories->where('id', $user->laboratory_id);
        }
        
        return Inertia::render('users/create', [
            'availableRoles' => $availableRoles,
            'laboratories' => $laboratories,
            'userLaboratory' => $user->laboratory_id,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request)
    {
        $user = auth()->user();
        
        $userData = $request->validated();
        
        // Set status based on creator role
        if ($user->isLabAssistant() && $userData['role'] === 'student') {
            // Lab assistants can directly activate students they create
            $userData['status'] = 'active';
        } elseif ($userData['role'] === 'student') {
            // Admin-created students start as active
            $userData['status'] = 'active';
        } else {
            // Staff roles start as active
            $userData['status'] = 'active';
        }
        
        $newUser = User::create($userData);
        
        // Log the action
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'user_created',
            'auditable_type' => User::class,
            'auditable_id' => $newUser->id,
            'old_values' => null,
            'new_values' => [
                'name' => $newUser->name,
                'email' => $newUser->email,
                'role' => $newUser->role,
                'status' => $newUser->status,
                'laboratory_id' => $newUser->laboratory_id,
            ],
        ]);
        
        return redirect()->route('users.show', $newUser)
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $currentUser = auth()->user();
        
        // Check authorization for lab assistants
        if ($currentUser->isLabAssistant() && 
            $user->laboratory_id !== $currentUser->laboratory_id && 
            $user->id !== $currentUser->id) {
            abort(403, 'You can only view users from your laboratory.');
        }
        
        $user->load(['laboratory', 'loanRequests', 'approvedRequests']);
        
        return Inertia::render('users/show', [
            'user' => $user,
            'canManage' => $currentUser->canManageUsers(),
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $currentUser = auth()->user();
        
        // Check authorization
        if ($currentUser->isLabAssistant() && $user->laboratory_id !== $currentUser->laboratory_id) {
            abort(403, 'You can only edit users from your laboratory.');
        }
        
        $laboratories = Laboratory::all();
        
        // Filter laboratories for lab assistants
        if ($currentUser->isLabAssistant()) {
            $laboratories = $laboratories->where('id', $currentUser->laboratory_id);
        }
        
        return Inertia::render('users/edit', [
            'user' => $user->load('laboratory'),
            'laboratories' => $laboratories,
            'canChangeRole' => $currentUser->isAdmin(),
        ]);
    }




}