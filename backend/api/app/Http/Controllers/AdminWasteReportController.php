<?php

namespace App\Http\Controllers;

use App\Enums\ReportStatus;
use App\Models\ReportStatusHistory;
use App\Models\WasteReport;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminWasteReportController extends Controller
{
    use ApiResponse;

    /**
     * Update waste report status and record history within a transaction.
     */
    public function updateStatus(Request $request, WasteReport $wasteReport): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(array_column(ReportStatus::cases(), 'value'))],
            'note' => ['nullable', 'string'],
        ]);

        $oldStatus = $wasteReport->status instanceof ReportStatus ? $wasteReport->status->value : $wasteReport->status;
        $newStatus = $validated['status'];

        DB::transaction(function () use ($wasteReport, $request, $oldStatus, $newStatus, $validated) {
            $wasteReport->update([
                'status' => $newStatus,
            ]);

            ReportStatusHistory::create([
                'waste_report_id' => $wasteReport->id,
                'changed_by' => $request->user()->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'note' => $validated['note'] ?? null,
                'created_at' => now(),
            ]);
        });

        $wasteReport->refresh();

        return $this->successResponse([
            'id' => $wasteReport->id,
            'status' => $wasteReport->status instanceof ReportStatus ? $wasteReport->status->value : $wasteReport->status,
            'updated_at' => $wasteReport->updated_at ? $wasteReport->updated_at->toISOString() : null,
        ], 'Report status updated successfully.');
    }
}

