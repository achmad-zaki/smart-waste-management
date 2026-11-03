<?php

namespace Database\Factories;

use App\Enums\ReportStatus;
use App\Enums\WasteCategory;
use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WasteReport>
 */
class WasteReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'image_url' => 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            'waste_category' => fake()->randomElement(WasteCategory::cases())->value,
            'confidence_score' => fake()->randomFloat(4, 0.5000, 0.9999),
            'latitude' => fake()->latitude(-90, 90),
            'longitude' => fake()->longitude(-180, 180),
            'address' => fake()->address(),
            'status' => ReportStatus::PENDING->value,
        ];
    }

    /**
     * Indicate that the status is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::PENDING->value,
        ]);
    }

    /**
     * Indicate that the status is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::IN_PROGRESS->value,
        ]);
    }

    /**
     * Indicate that the status is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::COMPLETED->value,
        ]);
    }

    /**
     * Indicate that the status is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::REJECTED->value,
        ]);
    }
}
