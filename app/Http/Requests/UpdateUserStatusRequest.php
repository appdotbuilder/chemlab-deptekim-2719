<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();
        return $user && $user->canManageUsers();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],
            'laboratory_id' => [
                'nullable',
                'exists:laboratories,id',
                $this->getLaboratoryRule(),
            ],
        ];
    }

    /**
     * Get the laboratory validation rule.
     *
     * @return string|null
     */
    protected function getLaboratoryRule(): ?string
    {
        $user = auth()->user();
        
        // Lab assistants can only assign users to their own laboratory
        if ($user->isLabAssistant()) {
            return "in:{$user->laboratory_id}";
        }
        
        return null;
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either active or inactive.',
            'laboratory_id.exists' => 'Selected laboratory does not exist.',
            'laboratory_id.in' => 'You can only assign users to your laboratory.',
        ];
    }
}