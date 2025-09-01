<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Laboratory;
use App\Models\LoanRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with role-specific data.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if ($user->isStudent()) {
            return $this->studentDashboard($request);
        }
        
        if ($user->isLabAssistant()) {
            return $this->labAssistantDashboard($request);
        }
        
        if ($user->isAdmin()) {
            return $this->adminDashboard($request);
        }
        
        return Inertia::render('dashboard');
    }

    /**
     * Student dashboard with available equipment and their loan requests.
     */
    protected function studentDashboard(Request $request)
    {
        $availableEquipment = Equipment::with('laboratory')
            ->active()
            ->available()
            ->when($request->search, function ($q, $search) {
                return $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            })
            ->latest()
            ->take(12)
            ->get();

        $myRequests = LoanRequest::with(['equipment', 'laboratory'])
            ->where('user_id', auth()->id())
            ->latest()
            ->take(5)
            ->get();

        $stats = [
            'pending_requests' => LoanRequest::where('user_id', auth()->id())->pending()->count(),
            'approved_requests' => LoanRequest::where('user_id', auth()->id())->approved()->count(),
            'borrowed_items' => LoanRequest::where('user_id', auth()->id())->borrowed()->count(),
            'available_equipment' => Equipment::active()->available()->count(),
        ];

        return Inertia::render('dashboard', [
            'availableEquipment' => $availableEquipment,
            'myRequests' => $myRequests,
            'stats' => $stats,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Lab assistant dashboard with laboratory-specific data.
     */
    protected function labAssistantDashboard(Request $request)
    {
        $user = auth()->user();
        
        $pendingRequests = LoanRequest::with(['user', 'equipment'])
            ->where('laboratory_id', $user->laboratory_id)
            ->pending()
            ->latest()
            ->take(10)
            ->get();

        $myEquipment = Equipment::where('laboratory_id', $user->laboratory_id)
            ->when($request->search, function ($q, $search) {
                return $q->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->take(8)
            ->get();

        $stats = [
            'pending_requests' => LoanRequest::where('laboratory_id', $user->laboratory_id)->pending()->count(),
            'borrowed_items' => LoanRequest::where('laboratory_id', $user->laboratory_id)->borrowed()->count(),
            'total_equipment' => Equipment::where('laboratory_id', $user->laboratory_id)->count(),
            'available_equipment' => Equipment::where('laboratory_id', $user->laboratory_id)->available()->count(),
        ];

        return Inertia::render('dashboard', [
            'pendingRequests' => $pendingRequests,
            'myEquipment' => $myEquipment,
            'stats' => $stats,
            'laboratory' => $user->laboratory,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Admin dashboard with system-wide overview.
     */
    protected function adminDashboard(Request $request)
    {
        $recentRequests = LoanRequest::with(['user', 'equipment', 'laboratory'])
            ->latest()
            ->take(10)
            ->get();

        $laboratories = Laboratory::withCount(['equipment', 'loanRequests'])
            ->active()
            ->get();

        $stats = [
            'total_users' => User::count(),
            'total_laboratories' => Laboratory::active()->count(),
            'total_equipment' => Equipment::count(),
            'pending_requests' => LoanRequest::pending()->count(),
            'borrowed_items' => LoanRequest::borrowed()->count(),
            'overdue_items' => LoanRequest::overdue()->count(),
        ];

        return Inertia::render('dashboard', [
            'recentRequests' => $recentRequests,
            'laboratories' => $laboratories,
            'stats' => $stats
        ]);
    }
}