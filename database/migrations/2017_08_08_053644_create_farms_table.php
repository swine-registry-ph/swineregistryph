<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFarmsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('farms', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('breeder_id')->unsigned();
            $table->foreign('breeder_id')->references('id')->on('breeders');
            $table->string('name');
            $table->text('farm_code');
            $table->date('farm_accreditation_date');
            $table->text('farm_accreditation_no');
            $table->text('address_line1');
            $table->text('address_line2');
            $table->text('province');
            $table->text('province_code');
            $table->boolean('is_suspended')->default('0');
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
        Schema::dropIfExists('farms');
    }
}
