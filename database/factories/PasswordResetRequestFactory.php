<?php

namespace Database\Factories;

use App\Models\PasswordResetRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PasswordResetRequest>
 */
class PasswordResetRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\PasswordResetRequest>
     */
    protected $model = PasswordResetRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'token' => PasswordResetRequest::generateToken(),
            'status' => 'pending',
            'requester_notes' => fake()->optional()->sentence(),
            'expires_at' => now()->addDays(7),
        ];
    }

    /**
     * Indicate that the request is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approver_id' => User::factory(),
            'approval_notes' => fake()->optional()->sentence(),
            'temporary_password' => PasswordResetRequest::generateTemporaryPassword(),
        ]);
    }

    /**
     * Indicate that the request is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'approver_id' => User::factory(),
            'approval_notes' => fake()->sentence(),
        ]);
    }

    /**
     * Indicate that the request is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'approver_id' => User::factory(),
            'approval_notes' => fake()->optional()->sentence(),
            'temporary_password' => PasswordResetRequest::generateTemporaryPassword(),
        ]);
    }

    /**
     * Indicate that the request is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subDays(1),
        ]);
    }
}