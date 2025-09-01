<?php

namespace Database\Factories;

use App\Models\Equipment;
use App\Models\Laboratory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LoanRequest>
 */
class LoanRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('now', '+1 month');
        $endDate = fake()->dateTimeBetween($startDate, '+2 months');

        return [
            'request_number' => 'REQ' . fake()->unique()->numberBetween(100000, 999999),
            'user_id' => User::factory(),
            'equipment_id' => Equipment::factory(),
            'laboratory_id' => Laboratory::factory(),
            'quantity_requested' => fake()->numberBetween(1, 3),
            'requested_start_date' => $startDate,
            'requested_end_date' => $endDate,
            'purpose' => fake()->paragraph(),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected', 'borrowed', 'returned', 'overdue']),
            'rejection_reason' => fake()->optional(0.2)->sentence(),
            'approved_by' => fake()->optional(0.7)->randomElement([1, 2, 3]),
            'approved_at' => fake()->optional(0.7)->dateTimeBetween('-1 month', 'now'),
            'borrowed_at' => fake()->optional(0.5)->dateTimeBetween('-1 month', 'now'),
            'returned_at' => fake()->optional(0.3)->dateTimeBetween('-1 month', 'now'),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the request is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approved_by' => null,
            'approved_at' => null,
            'borrowed_at' => null,
            'returned_at' => null,
        ]);
    }

    /**
     * Indicate that the request is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_by' => User::factory()->create(['role' => 'lab_assistant'])->id,
            'approved_at' => fake()->dateTimeBetween('-1 week', 'now'),
            'borrowed_at' => null,
            'returned_at' => null,
        ]);
    }

    /**
     * Indicate that the request is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => fake()->sentence(),
            'approved_by' => User::factory()->create(['role' => 'lab_assistant'])->id,
            'approved_at' => fake()->dateTimeBetween('-1 week', 'now'),
            'borrowed_at' => null,
            'returned_at' => null,
        ]);
    }

    /**
     * Indicate that the equipment is currently borrowed.
     */
    public function borrowed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'borrowed',
            'approved_by' => User::factory()->create(['role' => 'lab_assistant'])->id,
            'approved_at' => fake()->dateTimeBetween('-2 weeks', '-1 week'),
            'borrowed_at' => fake()->dateTimeBetween('-1 week', 'now'),
            'returned_at' => null,
        ]);
    }
}