<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            return true;
        }
        
        if ($user->isLabAssistant()) {
            return $this->laboratory_id === $user->laboratory_id;
        }
        
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'laboratory_id' => 'required|exists:laboratories,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:equipment,code',
            'description' => 'nullable|string',
            'brand' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'total_quantity' => 'required|integer|min:1',
            'available_quantity' => 'required|integer|min:0|lte:total_quantity',
            'condition' => 'required|in:excellent,good,fair,poor',
            'status' => 'required|in:active,maintenance,retired',
            'notes' => 'nullable|string',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Equipment name is required.',
            'code.required' => 'Equipment code is required.',
            'code.unique' => 'This equipment code already exists.',
            'laboratory_id.required' => 'Laboratory is required.',
            'laboratory_id.exists' => 'Selected laboratory does not exist.',
            'total_quantity.required' => 'Total quantity is required.',
            'total_quantity.min' => 'Total quantity must be at least 1.',
            'available_quantity.lte' => 'Available quantity cannot exceed total quantity.',
            'condition.in' => 'Condition must be excellent, good, fair, or poor.',
            'status.in' => 'Status must be active, maintenance, or retired.',
        ];
    }
}