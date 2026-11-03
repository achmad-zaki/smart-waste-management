<?php

namespace Database\Factories;

use App\Enums\ReportStatus;
use App\Models\ReportStatusHistory;
use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReportStatusHistory>
 */
class ReportStatusHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'waste_report_id' => WasteReport::factory(),
            'changed_by' => User::factory()->admin(),
            'old_status' => ReportStatus::PENDING->value,
            'new_status' => ReportStatus::IN_PROGRESS->value,
            'note' => fake()->sentence(),
            'created_at' => now(),
        ];
    }

    /**
     * Indicate an initial report creation history (old_status is null, new_status is pending).
     */
    public function initial(): static
    {
        return $this->state(fn (array $attributes) => [
            'old_status' => null,
            'new_status' => ReportStatus::PENDING->value,
            'note' => 'Laporan berhasil dibuat',
        ]);
    }
}
