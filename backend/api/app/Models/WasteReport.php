<?php

namespace App\Models;

use App\Enums\ReportStatus;
use App\Enums\WasteCategory;
use Database\Factories\WasteReportFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'title',
    'description',
    'image_url',
    'waste_category',
    'confidence_score',
    'latitude',
    'longitude',
    'address',
    'status',
])]
class WasteReport extends Model
{
    /** @use HasFactory<WasteReportFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'waste_category' => WasteCategory::class,
            'status' => ReportStatus::class,
            'confidence_score' => 'float',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    /**
     * The user who submitted the report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Status change history of this report.
     */
    public function statusHistories(): HasMany
    {
        return $this->hasMany(ReportStatusHistory::class);
    }

    /**
     * Determine if the report can be updated or deleted by the user (only when pending).
     */
    public function canBeModifiedByUser(): bool
    {
        return $this->status === ReportStatus::PENDING;
    }
}
