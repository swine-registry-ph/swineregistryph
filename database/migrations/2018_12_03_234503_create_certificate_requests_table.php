<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCertificateRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('certificate_requests', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('admin_id')->unsigned()->nullable();
            $table->integer('breeder_id')->unsigned();
            $table->foreign('breeder_id')->references('id')->on('breeders');
            $table->integer('farm_id')->unsigned();
            $table->foreign('farm_id')->references('id')->on('farms');
            $table->date('date_requested')->nullable();
            $table->date('date_payment')->nullable();
            $table->date('date_delivery')->nullable();
            $table->enum('status', [
                'draft', 'requested', 'for_payment', 'on_delivery'
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
        Schema::dropIfExists('certificate_requests');
    }
}
