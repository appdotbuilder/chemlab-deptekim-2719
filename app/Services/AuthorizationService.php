<?php

namespace App\Services;

use App\Models\User;
use App\Models\Equipment;
use App\Models\LoanRequest;

class AuthorizationService
{
    /**
     * Check if user can manage other users.
     *
     * @param User $user
     * @return bool
     */
    public static function canManageUsers(User $user): bool
    {
        return $user->canManageUsers();
    }

    /**
     * Check if user can create staff users.
     *
     * @param User $user
     * @return bool
     */
    public static function canCreateStaffUsers(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check if user can approve password resets.
     *
     * @param User $user
     * @return bool
     */
    public static function canApprovePasswordResets(User $user): bool
    {
        return $user->canApprovePasswordResets();
    }

    /**
     * Check if user can manage equipment.
     *
     * @param User $user
     * @param Equipment|null $equipment
     * @return bool
     */
    public static function canManageEquipment(User $user, Equipment $equipment = null): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isLabAssistant()) {
            return $equipment ? $equipment->laboratory_id === $user->laboratory_id : true;
        }

        return false;
    }

    /**
     * Check if user can manage laboratories.
     *
     * @param User $user
     * @return bool
     */
    public static function canManageLaboratories(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check if user can manage loan requests.
     *
     * @param User $user
     * @param LoanRequest|null $loanRequest
     * @return bool
     */
    public static function canManageLoanRequests(User $user, LoanRequest $loanRequest = null): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isLabAssistant()) {
            return $loanRequest 
                ? $loanRequest->equipment->laboratory_id === $user->laboratory_id
                : true;
        }

        return false;
    }

    /**
     * Check if user can view laboratory data.
     *
     * @param User $user
     * @param int|null $laboratoryId
     * @return bool
     */
    public static function canViewLaboratoryData(User $user, int $laboratoryId = null): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if (($user->isKepalaLab() || $user->isLabAssistant()) && $laboratoryId) {
            return $user->laboratory_id === $laboratoryId;
        }

        return false;
    }

    /**
     * Check if user can view all system data.
     *
     * @param User $user
     * @return bool
     */
    public static function canViewAllData(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Check if user can only view laboratory-specific data.
     *
     * @param User $user
     * @return bool
     */
    public static function canViewLaboratorySpecificData(User $user): bool
    {
        return $user->isLabAssistant() || $user->isKepalaLab();
    }

    /**
     * Get the laboratory IDs a user can access.
     *
     * @param User $user
     * @return array|null
     */
    public static function getAccessibleLaboratoryIds(User $user): ?array
    {
        if ($user->isAdmin()) {
            return null; // Can access all
        }

        if ($user->isLabAssistant() || $user->isKepalaLab()) {
            return [$user->laboratory_id];
        }

        return [];
    }
}