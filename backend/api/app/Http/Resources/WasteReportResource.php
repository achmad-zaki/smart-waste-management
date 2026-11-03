<?php

namespace App\Http\Resources;

use App\Enums\ReportStatus;
use App\Enums\WasteCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $categoryValue = $this->waste_category instanceof WasteCategory ? $this->waste_category->value : $this->waste_category;
        $statusValue = $this->status instanceof ReportStatus ? $this->status->value : $this->status;

        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'waste_category' => $categoryValue,
            'confidence_score' => $this->confidence_score !== null ? (float) $this->confidence_score : null,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'address' => $this->address,
            'status' => $statusValue,
            'created_at' => $this->created_at ? $this->created_at->toISOString() : null,
            'updated_at' => $this->updated_at ? $this->updated_at->toISOString() : null,
        ];

        if ($this->relationLoaded('user') && $this->user) {
            $data['user'] = [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ];
        }

        if ($this->relationLoaded('statusHistories')) {
            $data['status_histories'] = ReportStatusHistoryResource::collection($this->statusHistories);
        }

        return $data;
    }
}

