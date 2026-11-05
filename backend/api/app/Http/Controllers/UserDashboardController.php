<?php

namespace App\Http\Controllers;

use App\Enums\ReportStatus;
use App\Http\Resources\WasteReportResource;
use App\Models\WasteReport;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    use ApiResponse;

    /**
     * Get user-specific dashboard statistics.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $userReports = WasteReport::where('user_id', $userId);

        $totalReports = (clone $userReports)->count();
        $pendingReports = (clone $userReports)->where('status', ReportStatus::PENDING->value)->count();
        $inProgressReports = (clone $userReports)->where('status', ReportStatus::IN_PROGRESS->value)->count();
        $completedReports = (clone $userReports)->where('status', ReportStatus::COMPLETED->value)->count();
        $rejectedReports = (clone $userReports)->where('status', ReportStatus::REJECTED->value)->count();

        $reportsByCategory = [
            'organic' => (clone $userReports)->where('waste_category', \App\Enums\WasteCategory::ORGANIC->value)->count(),
            'plastic' => (clone $userReports)->where('waste_category', \App\Enums\WasteCategory::PLASTIC->value)->count(),
            'paper' => (clone $userReports)->where('waste_category', \App\Enums\WasteCategory::PAPER->value)->count(),
        ];

        $recentReports = (clone $userReports)
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

