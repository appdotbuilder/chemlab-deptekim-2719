<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('password_reset_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('token', 64)->unique()->comment('Unique request identifier');
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])
                  ->default('pending')
                  ->comment('Request status');
            $table->text('requester_notes')->nullable()->comment('Notes from user requesting reset');
            $table->foreignId('approver_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('approval_notes')->nullable()->comment('Notes from approver');
            $table->string('temporary_password')->nullable()->comment('Hashed temporary password');
            $table->timestamp('expires_at')->comment('Request expiry timestamp');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('status');
            $table->index('expires_at');
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_reset_requests');
    }
};