<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSwinePropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('swine_properties', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('swine_id')->unsigned();
            $table->foreign('swine_id')->references('id')->on('swines');
            $table->integer('property_id')->unsigned();
            $table->string('value');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('swine_properties');
    }
}
