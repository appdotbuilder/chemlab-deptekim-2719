<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property string $status
 * @property bool $force_password_change_on_next_login
 * @property int|null $laboratory_id
 * @property string|null $student_id
 * @property string|null $phone
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Laboratory|null $laboratory
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LoanRequest> $loanRequests
 * @property-read int|null $loan_requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LoanRequest> $approvedRequests
 * @property-read int|null $approved_requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AuditLog> $auditLogs
 * @property-read int|null $audit_logs_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PasswordResetRequest> $passwordResetRequests
 * @property-read int|null $password_reset_requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PasswordResetRequest> $approvedPasswordResetRequests
 * @property-read int|null $approved_password_reset_requests_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * 
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereForcePasswordChangeOnNextLogin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLaboratoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereStudentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User students()
 * @method static \Illuminate\Database\Eloquent\Builder|User labAssistants()
 * @method static \Illuminate\Database\Eloquent\Builder|User admins()
 * @method static \Illuminate\Database\Eloquent\Builder|User kepalaLabs()
 * @method static \Illuminate\Database\Eloquent\Builder|User dosens()
 * @method static \Illuminate\Database\Eloquent\Builder|User active()
 * @method static \Illuminate\Database\Eloquent\Builder|User pendingVerification()
 * @method static \Illuminate\Database\Eloquent\Builder|User inactive()
 * 
 * @mixin \Eloquent
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'force_password_change_on_next_login',
        'laboratory_id',
        'student_id',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'force_password_change_on_next_login' => 'boolean',
        ];
    }

    /**
     * Get the laboratory assigned to this user (for lab assistants and kepala lab).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class);
    }

    /**
     * Get all loan requests made by this user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function loanRequests(): HasMany
    {
        return $this->hasMany(LoanRequest::class);
    }

    /**
     * Get all loan requests approved by this user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function approvedRequests(): HasMany
    {
        return $this->hasMany(LoanRequest::class, 'approved_by');
    }

    /**
     * Get all audit logs created by this user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    /**
     * Get all password reset requests made by this user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function passwordResetRequests(): HasMany
    {
        return $this->hasMany(PasswordResetRequest::class);
    }

    /**
     * Get all password reset requests approved by this user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function approvedPasswordResetRequests(): HasMany
    {
        return $this->hasMany(PasswordResetRequest::class, 'approver_id');
    }

    /**
     * Scope a query to only include students.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeStudents($query)
    {
        return $query->where('role', 'student');
    }

    /**
     * Scope a query to only include lab assistants.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLabAssistants($query)
    {
        return $query->where('role', 'lab_assistant');
    }

    /**
     * Scope a query to only include admins.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    /**
     * Scope a query to only include kepala labs.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeKepalaLabs($query)
    {
        return $query->where('role', 'kepala_lab');
    }

    /**
     * Scope a query to only include dosens.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDosens($query)
    {
        return $query->where('role', 'dosen');
    }

    /**
     * Scope a query to only include active users.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include users pending verification.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePendingVerification($query)
    {
        return $query->where('status', 'pending_verification');
    }

    /**
     * Scope a query to only include inactive users.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if the user is a lab assistant.
     *
     * @return bool
     */
    public function isLabAssistant(): bool
    {
        return $this->role === 'lab_assistant';
    }

    /**
     * Check if the user is a student.
     *
     * @return bool
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Check if the user is a kepala lab.
     *
     * @return bool
     */
    public function isKepalaLab(): bool
    {
        return $this->role === 'kepala_lab';
    }

    /**
     * Check if the user is a dosen.
     *
     * @return bool
     */
    public function isDosen(): bool
    {
        return $this->role === 'dosen';
    }

    /**
     * Check if the user is active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the user is pending verification.
     *
     * @return bool
     */
    public function isPendingVerification(): bool
    {
        return $this->status === 'pending_verification';
    }

    /**
     * Check if the user is inactive.
     *
     * @return bool
     */
    public function isInactive(): bool
    {
        return $this->status === 'inactive';
    }

    /**
     * Check if the user needs to change password on next login.
     *
     * @return bool
     */
    public function mustChangePassword(): bool
    {
        return (bool) $this->force_password_change_on_next_login;
    }

    /**
     * Check if the user can manage users (Admin or Laboran).
     *
     * @return bool
     */
    public function canManageUsers(): bool
    {
        return $this->isAdmin() || $this->isLabAssistant();
    }

    /**
     * Check if the user can approve password reset requests.
     *
     * @return bool
     */
    public function canApprovePasswordResets(): bool
    {
        return $this->isAdmin() || $this->isLabAssistant();
    }

    /**
     * Check if the user has staff email domain.
     *
     * @return bool
     */
    public function hasStaffEmail(): bool
    {
        return str_ends_with($this->email, '@che.ui.ac.id');
    }

    /**
     * Check if the user has student email domain.
     *
     * @return bool
     */
    public function hasStudentEmail(): bool
    {
        return str_ends_with($this->email, '@ui.ac.id');
    }

    /**
     * Get the user's display role name.
     *
     * @return string
     */
    public function getRoleDisplayName(): string
    {
        return match ($this->role) {
            'admin' => 'Administrator',
            'lab_assistant' => 'Lab Assistant',
            'kepala_lab' => 'Head of Lab',
            'dosen' => 'Lecturer',
            'student' => 'Student',
            default => ucfirst($this->role),
        };
    }

    /**
     * Get the user's display status name.
     *
     * @return string
     */
    public function getStatusDisplayName(): string
    {
        return match ($this->status) {
            'active' => 'Active',
            'pending_verification' => 'Pending Verification',
            'inactive' => 'Inactive',
            default => ucfirst($this->status),
        };
    }
}