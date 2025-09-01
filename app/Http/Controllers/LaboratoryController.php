<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLaboratoryRequest;
use App\Http\Requests\UpdateLaboratoryRequest;
use App\Models\Laboratory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaboratoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied.');
        }
        
        $query = Laboratory::withCount(['equipment', 'loanRequests', 'labAssistants'])
            ->when($request->search, function ($q, $search) {
                return $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            })
            ->when($request->status, function ($q, $status) {
                return $q->where('status', $status);
            });

        $laboratories = $query->latest()->paginate(15);

        return Inertia::render('laboratories/index', [
            'laboratories' => $laboratories,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied.');
        }

        return Inertia::render('laboratories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLaboratoryRequest $request)
    {
        
        $laboratory = Laboratory::create($request->validated());

        return redirect()->route('laboratories.show', $laboratory)
            ->with('success', 'Laboratory created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Laboratory $laboratory)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied.');
        }
        
        $laboratory->load(['equipment', 'labAssistants']);

        return Inertia::render('laboratories/show', [
            'laboratory' => $laboratory
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Laboratory $laboratory)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied.');
        }

        return Inertia::render('laboratories/edit', [
            'laboratory' => $laboratory
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLaboratoryRequest $request, Laboratory $laboratory)
    {
        
        $laboratory->update($request->validated());

        return redirect()->route('laboratories.show', $laboratory)
            ->with('success', 'Laboratory updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Laboratory $laboratory)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied.');
        }
        
        $laboratory->delete();

        return redirect()->route('laboratories.index')
            ->with('success', 'Laboratory deleted successfully.');
    }
}