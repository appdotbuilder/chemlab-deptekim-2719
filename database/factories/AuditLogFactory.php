<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AuditLog>
 */
class AuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $actions = [
            'created', 'updated', 'deleted', 
            'approved_request', 'rejected_request', 
            'borrowed_equipment', 'returned_equipment',
            'login', 'logout'
        ];

        $modelTypes = [
            'App\Models\LoanRequest',
            'App\Models\Equipment',
            'App\Models\Laboratory',
            'App\Models\User'
        ];

        return [
            'user_id' => User::factory(),
            'action' => fake()->randomElement($actions),
            'model_type' => fake()->randomElement($modelTypes),
            'model_id' => fake()->numberBetween(1, 100),
            'old_values' => fake()->optional()->randomElements(['name' => 'Old Name', 'status' => 'old_status'], 2),
            'new_values' => fake()->optional()->randomElements(['name' => 'New Name', 'status' => 'new_status'], 2),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }

    /**
     * Indicate that this is a login action.
     */
    public function login(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => 'login',
            'model_type' => null,
            'model_id' => null,
            'old_values' => null,
            'new_values' => null,
        ]);
    }

    /**
     * Indicate that this is a logout action.
     */
    public function logout(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => 'logout',
            'model_type' => null,
            'model_id' => null,
            'old_values' => null,
            'new_values' => null,
        ]);
    }
}