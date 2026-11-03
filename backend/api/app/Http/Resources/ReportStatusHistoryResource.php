<?php

namespace App\Http\Resources;

use App\Enums\ReportStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportStatusHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $oldStatus = $this->old_status instanceof ReportStatus ? $this->old_status->value : $this->old_status;
        $newStatus = $this->new_status instanceof ReportStatus ? $this->new_status->value : $this->new_status;

        return [
            'id' => $this->id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'note' => $this->note,
            'changed_by' => $this->changed_by,
            'created_at' => $this->created_at ? $this->created_at->toISOString() : null,
        ];
    }
}

