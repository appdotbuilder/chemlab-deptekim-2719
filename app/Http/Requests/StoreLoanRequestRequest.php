<?php

namespace App\Http\Requests;

use App\Models\Equipment;
use Illuminate\Foundation\Http\FormRequest;

class StoreLoanRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'equipment_id' => 'required|exists:equipment,id',
            'quantity_requested' => 'required|integer|min:1|max:' . $this->getMaxQuantity(),
            'requested_start_date' => 'required|date|after_or_equal:today',
            'requested_end_date' => 'required|date|after:requested_start_date',
            'purpose' => 'required|string|max:1000',
            'notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get the maximum quantity that can be requested for the equipment.
     *
     * @return int
     */
    protected function getMaxQuantity(): int
    {
        if ($this->equipment_id) {
            $equipment = Equipment::find($this->equipment_id);
            return $equipment ? $equipment->available_quantity : 1;
        }
        
        return 1;
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'equipment_id.required' => 'Equipment selection is required.',
            'equipment_id.exists' => 'Selected equipment does not exist.',
            'quantity_requested.required' => 'Quantity is required.',
            'quantity_requested.min' => 'Quantity must be at least 1.',
            'quantity_requested.max' => 'Requested quantity exceeds available quantity.',
            'requested_start_date.required' => 'Start date is required.',
            'requested_start_date.after_or_equal' => 'Start date must be today or later.',
            'requested_end_date.required' => 'End date is required.',
            'requested_end_date.after' => 'End date must be after start date.',
            'purpose.required' => 'Purpose is required.',
            'purpose.max' => 'Purpose cannot exceed 1000 characters.',
            'notes.max' => 'Notes cannot exceed 500 characters.',
        ];
    }
}