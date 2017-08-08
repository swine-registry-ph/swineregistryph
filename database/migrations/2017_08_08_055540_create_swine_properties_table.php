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
            $table->integer('property_id')->unsigned();
            $table->float('value_quantitative');
            $table->text('value_qualitative');
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
