<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSwinesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('swines', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('collection_id')->unsigned();
            $table->integer('breed_id')->unsigned();
            $table->integer('farm_id')->unsigned();
            $table->integer('gpSire_id')->unsigned()->nullable();
            $table->integer('gpDam_id')->unsigned()->nullable();
            $table->text('registration_no')->nullable();
            $table->date('date_registered');
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
        Schema::dropIfExists('swines');
    }
}
