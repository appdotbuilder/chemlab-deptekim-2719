<?php

namespace Database\Factories;

use App\Models\Laboratory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
 */
class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $equipmentTypes = [
            'Microscope', 'Beaker', 'Flask', 'Test Tube', 'Bunsen Burner',
            'Thermometer', 'pH Meter', 'Balance', 'Centrifuge', 'Pipette',
            'Spectrometer', 'Incubator', 'Autoclave', 'Fume Hood', 'Hot Plate'
        ];
        
        $brands = ['Thermo Fisher', 'Agilent', 'Waters', 'PerkinElmer', 'Shimadzu', 'Bruker', 'VWR'];
        
        $totalQuantity = fake()->numberBetween(1, 10);
        $availableQuantity = fake()->numberBetween(0, $totalQuantity);

        return [
            'laboratory_id' => Laboratory::factory(),
            'name' => fake()->randomElement($equipmentTypes),
            'code' => 'EQ' . fake()->unique()->numberBetween(10000, 99999),
            'description' => fake()->paragraph(),
            'brand' => fake()->randomElement($brands),
            'model' => fake()->bothify('##??-####'),
            'total_quantity' => $totalQuantity,
            'available_quantity' => $availableQuantity,
            'condition' => fake()->randomElement(['excellent', 'good', 'fair', 'poor']),
            'status' => fake()->randomElement(['active', 'maintenance', 'retired']),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the equipment is available.
     */
    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'available_quantity' => fake()->numberBetween(1, 5),
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the equipment is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'available_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the equipment is under maintenance.
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'maintenance',
            'available_quantity' => 0,
        ]);
    }
}