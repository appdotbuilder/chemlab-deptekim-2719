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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['student', 'lab_assistant', 'admin'])->default('student')->comment('User role');
            $table->foreignId('laboratory_id')->nullable()->constrained()->nullOnDelete();
            $table->string('student_id', 20)->nullable()->comment('Student/Staff ID');
            $table->string('phone', 20)->nullable()->comment('Phone number');
            
            // Indexes for performance
            $table->index('role');
            $table->index('laboratory_id');
            $table->index('student_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['laboratory_id']);
            $table->dropIndex(['role']);
            $table->dropIndex(['laboratory_id']);
            $table->dropIndex(['student_id']);
            $table->dropColumn(['role', 'laboratory_id', 'student_id', 'phone']);
        });
    }
};