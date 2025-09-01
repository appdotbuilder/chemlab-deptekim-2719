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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action')->comment('Action performed');
            $table->string('model_type')->nullable()->comment('Model type affected');
            $table->unsignedBigInteger('model_id')->nullable()->comment('Model ID affected');
            $table->json('old_values')->nullable()->comment('Previous values');
            $table->json('new_values')->nullable()->comment('New values');
            $table->string('ip_address', 45)->nullable()->comment('IP address');
            $table->string('user_agent')->nullable()->comment('User agent');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('action');
            $table->index(['model_type', 'model_id']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};