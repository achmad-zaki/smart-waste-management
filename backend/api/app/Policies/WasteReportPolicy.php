<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WasteReport;

class WasteReportPolicy
{
    /**
     * Determine whether the user can view any reports.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the report.
     */
    public function view(User $user, WasteReport $wasteReport): bool
    {
        return $user->isAdmin() || $user->id === $wasteReport->user_id;
    }

    /**
     * Determine whether the user can create reports.
     */
    public function create(User $user): bool
    {
        return $user->isUser();
    }

    /**
     * Determine whether the user can update the report.
     */
    public function update(User $user, WasteReport $wasteReport): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $wasteReport->user_id && $wasteReport->canBeModifiedByUser();
    }

    /**
     * Determine whether the user can delete the report.
     */
    public function delete(User $user, WasteReport $wasteReport): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $wasteReport->user_id && $wasteReport->canBeModifiedByUser();
    }

    /**
     * Determine whether the user can update the status of the report.
     */
    public function updateStatus(User $user, WasteReport $wasteReport): bool
    {
        return $user->isAdmin();
    }
}

