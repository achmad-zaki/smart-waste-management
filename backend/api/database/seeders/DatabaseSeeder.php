<?php

namespace Database\Seeders;

use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Enums\WasteCategory;
use App\Models\ReportStatusHistory;
use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@smartwaste.local'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password123'),
                'role' => UserRole::ADMIN->value,
                'phone' => '081234567890',
            ]
        );

        // 2. Regular User
        $user = User::firstOrCreate(
            ['email' => 'user@smartwaste.local'],
            [
                'name' => 'Warga Peduli',
                'password' => Hash::make('password123'),
                'role' => UserRole::USER->value,
                'phone' => '089876543210',
            ]
        );

        // 3. Sample Report: Pending Organic
        $report1 = WasteReport::create([
            'user_id' => $user->id,
            'title' => 'Tumpukan Sampah Daun dan Ranting',
            'description' => 'Tumpukan sampah organik daun kering menumpuk di depan taman komplek.',
            'image_url' => 'https://res.cloudinary.com/demo/image/upload/v1/sample-organic.jpg',
            'waste_category' => WasteCategory::ORGANIC->value,
            'confidence_score' => 0.9425,
            'latitude' => -6.2000000,
            'longitude' => 106.8166667,
            'address' => 'Jl. Taman Melati No. 12, Jakarta',
            'status' => ReportStatus::PENDING->value,
        ]);

        ReportStatusHistory::create([
            'waste_report_id' => $report1->id,
            'changed_by' => null,
            'old_status' => null,
            'new_status' => ReportStatus::PENDING->value,
            'note' => 'Laporan dibuat oleh pengguna.',
            'created_at' => now(),
        ]);

        // 4. Sample Report: In Progress Plastic
        $report2 = WasteReport::create([
            'user_id' => $user->id,
            'title' => 'Limbah Botol Plastik di Pinggir Selokan',
            'description' => 'Banyak botol dan kemasan plastik menyumbat aliran air selokan.',
            'image_url' => 'https://res.cloudinary.com/demo/image/upload/v1/sample-plastic.jpg',
            'waste_category' => WasteCategory::PLASTIC->value,
            'confidence_score' => 0.8870,
            'latitude' => -6.2087654,
            'longitude' => 106.8456789,
            'address' => 'Jl. Selokan Bersih No. 45, Jakarta',
            'status' => ReportStatus::IN_PROGRESS->value,
        ]);

        ReportStatusHistory::create([
            'waste_report_id' => $report2->id,
            'changed_by' => null,
            'old_status' => null,
            'new_status' => ReportStatus::PENDING->value,
            'note' => 'Laporan dibuat oleh pengguna.',
            'created_at' => now()->subHours(2),
        ]);

        ReportStatusHistory::create([
            'waste_report_id' => $report2->id,
            'changed_by' => $admin->id,
            'old_status' => ReportStatus::PENDING->value,
            'new_status' => ReportStatus::IN_PROGRESS->value,
            'note' => 'Petugas kebersihan telah ditugaskan ke lokasi.',
            'created_at' => now()->subHour(),
        ]);
    }
}
