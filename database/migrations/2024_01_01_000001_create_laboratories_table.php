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
        Schema::create('laboratories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Laboratory name');
            $table->string('code', 10)->unique()->comment('Laboratory code (e.g., LAB001)');
            $table->text('description')->nullable()->comment('Laboratory description');
            $table->string('location')->nullable()->comment('Physical location of the laboratory');
            $table->enum('status', ['active', 'inactive'])->default('active')->comment('Laboratory status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('code');
            $table->index('status');
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laboratories');
    }
};