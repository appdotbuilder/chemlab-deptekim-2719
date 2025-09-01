<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserStatusRequest;
use App\Models\AuditLog;
use App\Models\User;

class UserStatusController extends Controller
{
    /**
     * Update the specified user's status.
     */
    public function update(UpdateUserStatusRequest $request, User $user)
    {
        $currentUser = auth()->user();
        
        // Check authorization for lab assistants
        if ($currentUser->isLabAssistant() && $user->laboratory_id !== $currentUser->laboratory_id) {
            abort(403, 'You can only manage users from your laboratory.');
        }
        
        $oldValues = [
            'status' => $user->status,
            'laboratory_id' => $user->laboratory_id,
        ];
        
        $updateData = ['status' => $request->status];
        
        // Handle laboratory assignment
        if ($request->status === 'active' && $request->laboratory_id) {
            $updateData['laboratory_id'] = $request->laboratory_id;
        }
        
        $user->update($updateData);
        
        // Log the action
        AuditLog::create([
            'user_id' => $currentUser->id,
            'action' => 'user_status_updated',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'old_values' => $oldValues,
            'new_values' => $updateData,
        ]);
        
        $message = $request->status === 'active' 
            ? 'User activated successfully.' 
            : 'User deactivated successfully.';
            
        return redirect()->route('users.show', $user)
            ->with('success', $message);
    }
}