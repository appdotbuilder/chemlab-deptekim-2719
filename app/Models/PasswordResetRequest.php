<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * App\Models\PasswordResetRequest
 *
 * @property int $id
 * @property int $user_id
 * @property string $token
 * @property string $status
 * @property string|null $requester_notes
 * @property int|null $approver_id
 * @property string|null $approval_notes
 * @property string|null $temporary_password
 * @property \Illuminate\Support\Carbon $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\User|null $approver
 *
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereApproverId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereApprovalNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereRequesterNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereTemporaryPassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest pending()
 * @method static \Illuminate\Database\Eloquent\Builder|PasswordResetRequest notExpired()
 * @method static \Database\Factories\PasswordResetRequestFactory factory($count = null, $state = [])
 *
 * @mixin \Eloquent
 */
class PasswordResetRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'token',
        'status',
        'requester_notes',
        'approver_id',
        'approval_notes',
        'temporary_password',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'temporary_password' => 'hashed',
    ];

    /**
     * Get the user who requested the password reset.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who approved/rejected the request.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    /**
     * Scope a query to only include pending requests.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include non-expired requests.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNotExpired($query)
    {
        return $query->where('expires_at', '>', now());
    }

    /**
     * Generate a unique token for the password reset request.
     *
     * @return string
     */
    public static function generateToken(): string
    {
        return Str::random(32);
    }

    /**
     * Generate a temporary password.
     *
     * @return string
     */
    public static function generateTemporaryPassword(): string
    {
        return Str::random(8);
    }

    /**
     * Check if the request is expired.
     *
     * @return bool
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if the request is pending.
     *
     * @return bool
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the request is approved.
     *
     * @return bool
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the request is completed.
     *
     * @return bool
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if the request is rejected.
     *
     * @return bool
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
}