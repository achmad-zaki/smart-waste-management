<?php

namespace App\Enums;

enum ReportStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Laporan baru diterima dan menunggu pemeriksaan',
            self::IN_PROGRESS => 'Laporan sedang ditangani',
            self::COMPLETED => 'Laporan selesai ditangani',
            self::REJECTED => 'Laporan ditolak oleh Admin',
        };
    }
}
