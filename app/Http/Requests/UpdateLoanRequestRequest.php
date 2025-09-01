<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoanRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();
        $loanRequest = $this->route('loan_request');
        
        // Students can only edit their own pending requests
        if ($user->isStudent()) {
            return $loanRequest->user_id === $user->id && $loanRequest->status === 'pending';
        }
        
        // Lab assistants can edit requests for their laboratory
        if ($user->isLabAssistant()) {
            return $loanRequest->laboratory_id === $user->laboratory_id;
        }
        
        // Admins can edit all requests
        return $user->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $loanRequest = $this->route('loan_request');
        $user = auth()->user();
        
        // Different validation rules based on user role and request status
        if ($user->isStudent() && $loanRequest->status === 'pending') {
            return [
                'quantity_requested' => 'required|integer|min:1',
                'requested_start_date' => 'required|date|after_or_equal:today',
                'requested_end_date' => 'required|date|after:requested_start_date',
                'purpose' => 'required|string|max:1000',
                'notes' => 'nullable|string|max:500',
            ];
        }
        
        // Lab assistants and admins can update status and approval fields
        return [
            'status' => 'required|in:pending,approved,rejected,borrowed,returned,overdue',
            'rejection_reason' => 'required_if:status,rejected|nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
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
            'quantity_requested.required' => 'Quantity is required.',
            'quantity_requested.min' => 'Quantity must be at least 1.',
            'requested_start_date.required' => 'Start date is required.',
            'requested_start_date.after_or_equal' => 'Start date must be today or later.',
            'requested_end_date.required' => 'End date is required.',
            'requested_end_date.after' => 'End date must be after start date.',
            'purpose.required' => 'Purpose is required.',
            'purpose.max' => 'Purpose cannot exceed 1000 characters.',
            'status.required' => 'Status is required.',
            'status.in' => 'Invalid status selected.',
            'rejection_reason.required_if' => 'Rejection reason is required when rejecting a request.',
            'rejection_reason.max' => 'Rejection reason cannot exceed 500 characters.',
            'notes.max' => 'Notes cannot exceed 500 characters.',
        ];
    }
}