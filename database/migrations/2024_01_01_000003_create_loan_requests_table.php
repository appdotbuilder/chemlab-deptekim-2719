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
        Schema::create('loan_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number', 20)->unique()->comment('Unique request number');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('equipment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('laboratory_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity_requested')->default(1)->comment('Quantity requested');
            $table->date('requested_start_date')->comment('Requested start date');
            $table->date('requested_end_date')->comment('Requested end date');
            $table->text('purpose')->comment('Purpose of borrowing');
            $table->enum('status', ['pending', 'approved', 'rejected', 'borrowed', 'returned', 'overdue'])->default('pending')->comment('Request status');
            $table->text('rejection_reason')->nullable()->comment('Reason for rejection if applicable');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable()->comment('Approval timestamp');
            $table->timestamp('borrowed_at')->nullable()->comment('Borrowing timestamp');
            $table->timestamp('returned_at')->nullable()->comment('Return timestamp');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('request_number');
            $table->index('user_id');
            $table->index('equipment_id');
            $table->index('laboratory_id');
            $table->index('status');
            $table->index(['laboratory_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index(['status', 'requested_start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_requests');
    }
};