<?php

namespace App\Models;

use App\Enums\ReportStatus;
use Database\Factories\ReportStatusHistoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'waste_report_id',
    'changed_by',
    'old_status',
    'new_status',
    'note',
])]
class ReportStatusHistory extends Model
{
    /** @use HasFactory<ReportStatusHistoryFactory> */
    use HasFactory;

    /**
     * The name of the "updated at" column.
     * The table only tracks created_at timestamp.
     *
     * @var string|null
     */
    const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'old_status' => ReportStatus::class,
            'new_status' => ReportStatus::class,
            'created_at' => 'datetime',
        ];
    }

    /**
     * The associated waste report.
     */
    public function wasteReport(): BelongsTo
    {
        return $this->belongsTo(WasteReport::class);
    }

    /**
     * The user / admin who triggered this status change.
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
