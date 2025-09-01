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
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laboratory_id')->constrained()->cascadeOnDelete();
            $table->string('name')->comment('Equipment name');
            $table->string('code', 20)->unique()->comment('Equipment code');
            $table->text('description')->nullable()->comment('Equipment description');
            $table->string('brand')->nullable()->comment('Equipment brand');
            $table->string('model')->nullable()->comment('Equipment model');
            $table->integer('total_quantity')->default(1)->comment('Total quantity available');
            $table->integer('available_quantity')->default(1)->comment('Currently available quantity');
            $table->enum('condition', ['excellent', 'good', 'fair', 'poor'])->default('good')->comment('Equipment condition');
            $table->enum('status', ['active', 'maintenance', 'retired'])->default('active')->comment('Equipment status');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('code');
            $table->index('laboratory_id');
            $table->index(['laboratory_id', 'status']);
            $table->index(['status', 'available_quantity']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};