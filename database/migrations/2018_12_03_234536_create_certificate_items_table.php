<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCertificateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('certificate_items', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('certificate_request_id')->unsigned();
            $table->foreign('certificate_request_id')->references('id')->on('inspection_requests');
            $table->integer('swine_id')->unsigned();
            $table->foreign('swine_id')->references('id')->on('swines');
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
        Schema::dropIfExists('certificate_items');
    }
}
