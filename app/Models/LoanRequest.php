<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\LoanRequest
 *
 * @property int $id
 * @property string $request_number
 * @property int $user_id
 * @property int $equipment_id
 * @property int $laboratory_id
 * @property int $quantity_requested
 * @property string $requested_start_date
 * @property string $requested_end_date
 * @property string $purpose
 * @property string $status
 * @property string|null $rejection_reason
 * @property int|null $approved_by
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property \Illuminate\Support\Carbon|null $borrowed_at
 * @property \Illuminate\Support\Carbon|null $returned_at
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Equipment $equipment
 * @property-read \App\Models\Laboratory $laboratory
 * @property-read \App\Models\User|null $approver
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereApprovedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereBorrowedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereEquipmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereLaboratoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest wherePurpose($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereQuantityRequested($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereRejectionReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereRequestNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereRequestedEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereRequestedStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereReturnedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest pending()
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest approved()
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest borrowed()
 * @method static \Illuminate\Database\Eloquent\Builder|LoanRequest overdue()
 * @method static \Database\Factories\LoanRequestFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class LoanRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'request_number',
        'user_id',
        'equipment_id',
        'laboratory_id',
        'quantity_requested',
        'requested_start_date',
        'requested_end_date',
        'purpose',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'borrowed_at',
        'returned_at',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity_requested' => 'integer',
        'requested_start_date' => 'date',
        'requested_end_date' => 'date',
        'approved_at' => 'datetime',
        'borrowed_at' => 'datetime',
        'returned_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who made the loan request.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the equipment being requested.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    /**
     * Get the laboratory that owns the equipment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class);
    }

    /**
     * Get the user who approved the request.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
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
     * Scope a query to only include approved requests.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include borrowed items.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBorrowed($query)
    {
        return $query->where('status', 'borrowed');
    }

    /**
     * Scope a query to only include overdue items.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }
}