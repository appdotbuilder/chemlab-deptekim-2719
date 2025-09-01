<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Equipment
 *
 * @property int $id
 * @property int $laboratory_id
 * @property string $name
 * @property string $code
 * @property string|null $description
 * @property string|null $brand
 * @property string|null $model
 * @property int $total_quantity
 * @property int $available_quantity
 * @property string $condition
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Laboratory $laboratory
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LoanRequest> $loanRequests
 * @property-read int|null $loan_requests_count
 * @property-read int $borrowed_quantity
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment query()
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereAvailableQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereBrand($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereCondition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereLaboratoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereTotalQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment available()
 * @method static \Illuminate\Database\Eloquent\Builder|Equipment active()
 * @method static \Database\Factories\EquipmentFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Equipment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'laboratory_id',
        'name',
        'code',
        'description',
        'brand',
        'model',
        'total_quantity',
        'available_quantity',
        'condition',
        'status',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_quantity' => 'integer',
        'available_quantity' => 'integer',
        'laboratory_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the laboratory that owns this equipment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class);
    }

    /**
     * Get all loan requests for this equipment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function loanRequests(): HasMany
    {
        return $this->hasMany(LoanRequest::class);
    }

    /**
     * Get the borrowed quantity (currently on loan).
     *
     * @return int
     */
    public function getBorrowedQuantityAttribute(): int
    {
        return $this->loanRequests()
            ->where('status', 'borrowed')
            ->sum('quantity_requested');
    }

    /**
     * Scope a query to only include available equipment.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAvailable($query)
    {
        return $query->where('available_quantity', '>', 0);
    }

    /**
     * Scope a query to only include active equipment.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}