<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLaboratoryResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('laboratory_results', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('genomics_id')->unsigned();
            $table->foreign('genomics_id')->references('id')->on('genomics');
            $table->integer('farm_id')->unsigned();
            $table->foreign('farm_id')->references('id')->on('farms');
            $table->text('laboratory_result_no');
            $table->text('animal_id');
            $table->string('sex');
            $table->date('date_result');
            $table->date('date_submitted');
            $table->boolean('is_used')->default('0');
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
        Schema::dropIfExists('laboratory_results');
    }
}
