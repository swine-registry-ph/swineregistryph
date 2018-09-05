<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLaboratoryTestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('laboratory_tests', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('laboratory_test_id')->unsigned();
            $table->foreign('laboratory_test_id')->references('id')->on('laboratory_results');
            $table->integer('test_id')->unsigned();
            $table->text('result');
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
        Schema::dropIfExists('laboratory_tests');
    }
}
