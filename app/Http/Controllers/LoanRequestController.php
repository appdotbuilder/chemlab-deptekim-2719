<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLoanRequestRequest;
use App\Http\Requests\UpdateLoanRequestRequest;
use App\Models\Equipment;
use App\Models\LoanRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = LoanRequest::with(['user', 'equipment', 'laboratory'])
            ->when(auth()->user()->isStudent(), function ($q) {
                return $q->where('user_id', auth()->id());
            })
            ->when(auth()->user()->isLabAssistant(), function ($q) {
                return $q->where('laboratory_id', auth()->user()->laboratory_id);
            })
            ->when($request->status, function ($q, $status) {
                return $q->where('status', $status);
            })
            ->when($request->search, function ($q, $search) {
                return $q->where('request_number', 'like', "%{$search}%")
                    ->orWhereHas('equipment', function ($eq) use ($search) {
                        $eq->where('name', 'like', "%{$search}%");
                    });
            });

        $loanRequests = $query->latest()->paginate(15);

        return Inertia::render('loan-requests/index', [
            'loanRequests' => $loanRequests,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $equipment = null;
        
        if ($request->equipment_id) {
            $equipment = Equipment::with('laboratory')
                ->where('status', 'active')
                ->where('available_quantity', '>', 0)
                ->findOrFail($request->equipment_id);
        }

        return Inertia::render('loan-requests/create', [
            'equipment' => $equipment
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLoanRequestRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['request_number'] = 'REQ' . str_pad((string)(LoanRequest::count() + 1), 6, '0', STR_PAD_LEFT);
        
        // Get the equipment to set laboratory_id
        $equipment = Equipment::findOrFail($data['equipment_id']);
        $data['laboratory_id'] = $equipment->laboratory_id;

        $loanRequest = LoanRequest::create($data);

        return redirect()->route('loan-requests.show', $loanRequest)
            ->with('success', 'Loan request submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LoanRequest $loanRequest)
    {
        $user = auth()->user();
        if (!$user->isAdmin() && 
            !($user->isLabAssistant() && $user->laboratory_id === $loanRequest->laboratory_id) &&
            !($user->isStudent() && $user->id === $loanRequest->user_id)) {
            abort(403, 'Access denied.');
        }
        
        $loanRequest->load(['user', 'equipment', 'laboratory', 'approver']);

        return Inertia::render('loan-requests/show', [
            'loanRequest' => $loanRequest
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LoanRequest $loanRequest)
    {
        $user = auth()->user();
        if (!$user->isAdmin() && 
            !($user->isLabAssistant() && $user->laboratory_id === $loanRequest->laboratory_id) &&
            !($user->isStudent() && $user->id === $loanRequest->user_id && $loanRequest->status === 'pending')) {
            abort(403, 'Access denied.');
        }

        return Inertia::render('loan-requests/edit', [
            'loanRequest' => $loanRequest->load('equipment')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLoanRequestRequest $request, LoanRequest $loanRequest)
    {
        
        $loanRequest->update($request->validated());

        return redirect()->route('loan-requests.show', $loanRequest)
            ->with('success', 'Loan request updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LoanRequest $loanRequest)
    {
        $user = auth()->user();
        if (!$user->isAdmin() && 
            !($user->isLabAssistant() && $user->laboratory_id === $loanRequest->laboratory_id) &&
            !($user->isStudent() && $user->id === $loanRequest->user_id && $loanRequest->status === 'pending')) {
            abort(403, 'Access denied.');
        }
        
        $loanRequest->delete();

        return redirect()->route('loan-requests.index')
            ->with('success', 'Loan request deleted successfully.');
    }
}