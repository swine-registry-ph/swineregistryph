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
            $table->integer('breeder_id')->unsigned();
            $table->integer('breed_id')->unsigned();
            $table->integer('farm_id')->unsigned();
            $table->integer('gpSire_id')->unsigned()->nullable();
            $table->integer('gpDam_id')->unsigned()->nullable();
            $table->integer('primaryPhoto_id')->unsigned()->default(0);
            $table->text('registration_no')->nullable();
            $table->date('date_registered');
            $table->boolean('swinecart')->default(0);
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
