<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();
        
        // Only admins can create non-student users
        if (in_array($this->role, ['admin', 'lab_assistant', 'kepala_lab', 'dosen'])) {
            return $user && $user->isAdmin();
        }
        
        // Admins and lab assistants can create student accounts
        return $user && ($user->isAdmin() || $user->isLabAssistant());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = auth()->user();
        $emailDomainRule = $this->getEmailDomainRule();
        
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'unique:users,email',
                $emailDomainRule,
            ],
            'password' => [
                'required',
                Rules\Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers(),
            ],
            'role' => [
                'required',
                Rule::in($this->getAllowedRoles()),
            ],
            'laboratory_id' => [
                'nullable',
                'exists:laboratories,id',
                $this->getLaboratoryRule(),
            ],
            'student_id' => 'nullable|string|max:20|unique:users,student_id',
            'phone' => 'nullable|string|max:20',
        ];
    }

    /**
     * Get the email domain validation rule.
     *
     * @return string
     */
    protected function getEmailDomainRule(): string
    {
        if ($this->role === 'student') {
            return 'regex:/^[a-zA-Z0-9._%+-]+@ui\.ac\.id$/';
        }
        
        return 'regex:/^[a-zA-Z0-9._%+-]+@che\.ui\.ac\.id$/';
    }

    /**
     * Get the allowed roles for the authenticated user.
     *
     * @return array
     */
    protected function getAllowedRoles(): array
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            return ['student', 'lab_assistant', 'kepala_lab', 'dosen', 'admin'];
        }
        
        if ($user->isLabAssistant()) {
            return ['student'];
        }
        
        return [];
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
            'name.required' => 'Full name is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered.',
            'email.regex' => $this->getEmailDomainMessage(),
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.letters' => 'Password must contain letters.',
            'password.mixed' => 'Password must contain both uppercase and lowercase letters.',
            'password.numbers' => 'Password must contain numbers.',
            'role.required' => 'Role is required.',
            'role.in' => 'Invalid role selected.',
            'laboratory_id.exists' => 'Selected laboratory does not exist.',
            'laboratory_id.in' => 'You can only assign users to your laboratory.',
            'student_id.unique' => 'This student/staff ID is already registered.',
        ];
    }

    /**
     * Get the email domain error message.
     *
     * @return string
     */
    protected function getEmailDomainMessage(): string
    {
        if ($this->role === 'student') {
            return 'Students must use @ui.ac.id email domain.';
        }
        
        return 'Staff members must use @che.ui.ac.id email domain.';
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        $user = auth()->user();
        
        // If lab assistant is creating a student, auto-assign to their laboratory
        if ($user->isLabAssistant() && $this->role === 'student') {
            $this->merge([
                'laboratory_id' => $user->laboratory_id,
            ]);
        }
    }
}