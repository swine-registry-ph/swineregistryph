<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInspectionRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inspection_requests', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('evaluator_id')->unsigned()->nullable();
            $table->integer('breeder_id')->unsigned();
            $table->foreign('breeder_id')->references('id')->on('breeders');
            $table->integer('farm_id')->unsigned();
            $table->foreign('farm_id')->references('id')->on('farms');
            $table->date('date_requested')->nullable();
            $table->date('date_inspection')->nullable();
            $table->date('date_approved')->nullable();
            $table->enum('status', [
                'draft', 'requested', 'for_inspection', 'approved'
            ])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inspection_requests');
    }
}
