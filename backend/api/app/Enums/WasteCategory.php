<?php

namespace App\Enums;

enum WasteCategory: string
{
    case ORGANIC = 'organic';
    case PLASTIC = 'plastic';
    case PAPER = 'paper';

    public function label(): string
    {
        return match ($this) {
            self::ORGANIC => 'Sampah organik',
            self::PLASTIC => 'Sampah plastik',
            self::PAPER => 'Sampah kertas',
        };
    }
}
