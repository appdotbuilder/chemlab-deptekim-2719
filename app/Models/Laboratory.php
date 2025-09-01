<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Laboratory
 *
 * @property int $id
 * @property string $name
 * @property string $code
 * @property string|null $description
 * @property string|null $location
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Equipment> $equipment
 * @property-read int|null $equipment_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LoanRequest> $loanRequests
 * @property-read int|null $loan_requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $labAssistants
 * @property-read int|null $lab_assistants_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory query()
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Laboratory active()
 * @method static \Database\Factories\LaboratoryFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Laboratory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'location',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get all equipment belonging to this laboratory.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }

    /**
     * Get all loan requests for this laboratory.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function loanRequests(): HasMany
    {
        return $this->hasMany(LoanRequest::class);
    }

    /**
     * Get all lab assistants assigned to this laboratory.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function labAssistants(): HasMany
    {
        return $this->hasMany(User::class)->where('role', 'lab_assistant');
    }

    /**
     * Scope a query to only include active laboratories.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}