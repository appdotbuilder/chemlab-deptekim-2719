<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;
use App\Models\Equipment;
use App\Models\Laboratory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Equipment::with(['laboratory'])
            ->when(auth()->user()->isLabAssistant(), function ($q) {
                return $q->where('laboratory_id', auth()->user()->laboratory_id);
            })
            ->when($request->search, function ($q, $search) {
                return $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            })
            ->when($request->status, function ($q, $status) {
                return $q->where('status', $status);
            })
            ->when($request->laboratory_id, function ($q, $labId) {
                return $q->where('laboratory_id', $labId);
            });

        $equipment = $query->latest()->paginate(15);
        
        $laboratories = auth()->user()->isAdmin() 
            ? Laboratory::active()->get()
            : collect([auth()->user()->laboratory]);

        return Inertia::render('equipment/index', [
            'equipment' => $equipment,
            'laboratories' => $laboratories,
            'filters' => $request->only(['search', 'status', 'laboratory_id'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $laboratories = auth()->user()->isAdmin() 
            ? Laboratory::active()->get()
            : collect([auth()->user()->laboratory]);

        return Inertia::render('equipment/create', [
            'laboratories' => $laboratories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEquipmentRequest $request)
    {
        $equipment = Equipment::create($request->validated());

        return redirect()->route('equipment.show', $equipment)
            ->with('success', 'Equipment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipment $equipment)
    {
        $user = auth()->user();
        if (!$user->isAdmin() && !($user->isLabAssistant() && $user->laboratory_id === $equipment->laboratory_id)) {
            // Students can view equipment details
            if (!$user->isStudent()) {
                abort(403, 'Access denied.');
            }
        }
        
        $equipment->load(['laboratory', 'loanRequests.user']);

        return Inertia::render('equipment/show', [
            'equipment' => $equipment
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Equipment $equipment)
    {
        $user = auth()->user();
        if (!$user->isAdmin() && !($user->isLabAssistant() && $user->laboratory_id === $equipment->laboratory_id)) {
            abort(403, 'Access denied.');
        }
        
        $laboratories = auth()->user()->isAdmin() 
            ? Laboratory::active()->get()
            : collect([auth()->user()->laboratory]);

        return Inertia::render('equipment/edit', [
            'equipment' => $equipment,
            'laboratories' => $laboratories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEquipmentRequest $request, Equipment $equipment)
    {
        
        $equipment->update($request->validated());

        return redirect()->route('equipment.show', $equipment)
            ->with('success', 'Equipment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipment $equipment)
    {
        $user = auth()->user();
        if (!$user->isAdmin() && !($user->isLabAssistant() && $user->laboratory_id === $equipment->laboratory_id)) {
            abort(403, 'Access denied.');
        }
        
        $equipment->delete();

        return redirect()->route('equipment.index')
            ->with('success', 'Equipment deleted successfully.');
    }
}