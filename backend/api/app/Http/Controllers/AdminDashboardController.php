<?php

namespace App\Http\Controllers;

use App\Enums\ReportStatus;
use App\Enums\WasteCategory;
use App\Http\Resources\WasteReportResource;
use App\Models\WasteReport;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    use ApiResponse;

    /**
     * Get system-wide dashboard statistics for Admin.
     */
    public function index(): JsonResponse
    {
        $totalReports = WasteReport::count();
        $pendingReports = WasteReport::where('status', ReportStatus::PENDING->value)->count();
        $inProgressReports = WasteReport::where('status', ReportStatus::IN_PROGRESS->value)->count();
        $completedReports = WasteReport::where('status', ReportStatus::COMPLETED->value)->count();
        $rejectedReports = WasteReport::where('status', ReportStatus::REJECTED->value)->count();

        $reportsByCategory = [
            'organic' => WasteReport::where('waste_category', WasteCategory::ORGANIC->value)->count(),
            'plastic' => WasteReport::where('waste_category', WasteCategory::PLASTIC->value)->count(),
            'paper' => WasteReport::where('waste_category', WasteCategory::PAPER->value)->count(),
        ];

        $recentReports = WasteReport::with('user')
            ->latest('created_at')
            ->take(5)
            ->get();

        return $this->successResponse([
            'total_reports' => $totalReports,
            'pending_reports' => $pendingReports,
            'in_progress_reports' => $inProgressReports,
            'completed_reports' => $completedReports,
            'rejected_reports' => $rejectedReports,
            'reports_by_category' => $reportsByCategory,
            'recent_reports' => WasteReportResource::collection($recentReports),
        ]);
    }
}

