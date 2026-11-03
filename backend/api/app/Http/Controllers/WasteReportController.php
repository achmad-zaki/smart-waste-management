<?php

namespace App\Http\Controllers;

use App\Enums\ReportStatus;
use App\Enums\WasteCategory;
use App\Http\Resources\WasteReportResource;
use App\Models\ReportStatusHistory;
use App\Models\WasteReport;
use App\Services\ImageUploadService;
use App\Services\MlPredictionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class WasteReportController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of reports.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = WasteReport::with('user');

        // Normal users only see their own reports
        if ($user->isUser()) {
            $query->where('user_id', $user->id);
        }

        // Search by title
        if ($request->filled('search')) {
            $searchTerm = '%'.$request->search.'%';
            $query->where('title', 'like', $searchTerm);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->filled('waste_category')) {
            $query->where('waste_category', $request->waste_category);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Sorting
        $allowedSorts = ['id', 'title', 'status', 'waste_category', 'created_at'];
        $sortBy = in_array($request->sort_by, $allowedSorts, true) ? $request->sort_by : 'created_at';
        $sortDirection = strtolower($request->sort_direction) === 'asc' ? 'asc' : 'desc';

        $query->orderBy($sortBy, $sortDirection);

        $perPage = max(1, min((int) $request->input('per_page', 10), 100));
        $paginator = $query->paginate($perPage);

        return $this->paginatedResponse($paginator, fn ($report) => (new WasteReportResource($report))->resolve());
    }

    /**
     * Display the specified report.
     */
    public function show(WasteReport $wasteReport): JsonResponse
    {
        Gate::authorize('view', $wasteReport);

        $wasteReport->load(['user', 'statusHistories']);

        return $this->successResponse(new WasteReportResource($wasteReport));
    }

    /**
     * Classify waste image via ML service.
     */
    public function classify(Request $request, MlPredictionService $mlService): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'image', 'max:5120', 'mimes:jpeg,png,jpg,webp'],
        ]);

        $result = $mlService->predict($request->file('image'));

        return $this->successResponse($result, 'Image classified successfully.');
    }

    /**
     * Store a newly created report in storage.
     */
    public function store(Request $request, ImageUploadService $uploadService): JsonResponse
    {
        Gate::authorize('create', WasteReport::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['required', 'file', 'image', 'max:5120', 'mimes:jpeg,png,jpg,webp'],
            'waste_category' => ['required', 'string', Rule::in(array_column(WasteCategory::cases(), 'value'))],
            'confidence_score' => ['nullable', 'numeric', 'between:0,1'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $imageUrl = $uploadService->upload($request->file('image'));

        $report = DB::transaction(function () use ($request, $validated, $imageUrl) {
            $report = WasteReport::create([
                'user_id' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'image_url' => $imageUrl,
                'waste_category' => $validated['waste_category'],
                'confidence_score' => $validated['confidence_score'] ?? null,
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'address' => $validated['address'] ?? null,
                'status' => ReportStatus::PENDING->value,
            ]);

            ReportStatusHistory::create([
                'waste_report_id' => $report->id,
                'changed_by' => null,
                'old_status' => null,
                'new_status' => ReportStatus::PENDING->value,
                'note' => 'Laporan dibuat.',
                'created_at' => now(),
            ]);

            return $report;
        });

        return $this->createdResponse([
            'id' => $report->id,
            'title' => $report->title,
            'description' => $report->description,
            'image_url' => $report->image_url,
            'waste_category' => $report->waste_category instanceof WasteCategory ? $report->waste_category->value : $report->waste_category,
            'confidence_score' => $report->confidence_score !== null ? (float) $report->confidence_score : null,
            'latitude' => (float) $report->latitude,
            'longitude' => (float) $report->longitude,
            'address' => $report->address,
            'status' => $report->status instanceof ReportStatus ? $report->status->value : $report->status,
            'created_at' => $report->created_at ? $report->created_at->toISOString() : null,
        ], 'Report created successfully.');
    }

    /**
     * Update the specified report in storage.
     */
    public function update(Request $request, WasteReport $wasteReport, ImageUploadService $uploadService): JsonResponse
    {
        Gate::authorize('update', $wasteReport);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'waste_category' => ['sometimes', 'required', 'string', Rule::in(array_column(WasteCategory::cases(), 'value'))],
            'latitude' => ['sometimes', 'required', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'required', 'numeric', 'between:-180,180'],
            'address' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'file', 'image', 'max:5120', 'mimes:jpeg,png,jpg,webp'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image_url'] = $uploadService->upload($request->file('image'));
            unset($validated['image']);
        }

        $wasteReport->update($validated);

        return $this->successResponse([
            'id' => $wasteReport->id,
            'title' => $wasteReport->title,
            'status' => $wasteReport->status instanceof ReportStatus ? $wasteReport->status->value : $wasteReport->status,
        ], 'Report updated successfully.');
    }

    /**
     * Remove the specified report from storage.
     */
    public function destroy(WasteReport $wasteReport): JsonResponse
    {
        Gate::authorize('delete', $wasteReport);

        $wasteReport->delete();

        return $this->successResponse(null, 'Report deleted successfully.');
    }
}
