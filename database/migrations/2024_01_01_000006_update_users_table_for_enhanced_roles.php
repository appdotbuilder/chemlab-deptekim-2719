<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['active', 'pending_verification', 'inactive'])
                  ->default('pending_verification')
                  ->comment('Account status');
                  
            $table->boolean('force_password_change_on_next_login')
                  ->default(false)
                  ->comment('Force password change on next login');
                  
            // Add indexes
            $table->index('status');
        });
        
        // Update all existing users to have active status
        DB::table('users')->update(['status' => 'active']);
        
        // Create a temporary table to handle role enum update
        Schema::table('users', function (Blueprint $table) {
            $table->string('role_temp')->nullable();
        });
        
        // Copy existing role values
        DB::table('users')->update([
            'role_temp' => DB::raw('role')
        ]);
        
        // Drop the old role column and indexes
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropColumn('role');
        });
        
        // Add new role column with extended enum
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['student', 'lab_assistant', 'admin', 'kepala_lab', 'dosen'])
                  ->default('student')
                  ->comment('User role');
            $table->index('role');
        });
        
        // Copy back the role values
        DB::table('users')->update([
            'role' => DB::raw('role_temp')
        ]);
        
        // Drop temporary column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role_temp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropColumn(['status', 'force_password_change_on_next_login']);
        });
        
        // Handle role downgrade
        Schema::table('users', function (Blueprint $table) {
            $table->string('role_temp')->nullable();
        });
        
        DB::table('users')->update([
            'role_temp' => DB::raw('role')
        ]);
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropColumn('role');
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['student', 'lab_assistant', 'admin'])
                  ->default('student')
                  ->comment('User role');
            $table->index('role');
        });
        
        // Only keep valid roles, convert others to student
        DB::statement("UPDATE users SET role = CASE 
            WHEN role_temp IN ('student', 'lab_assistant', 'admin') THEN role_temp 
            ELSE 'student' 
        END");
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role_temp');
        });
    }
};