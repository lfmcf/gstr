<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVentesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ventes', function (Blueprint $table) {
            $table->id();
            $table->string('bon');
            $table->dateTime('date');
            $table->string('vendeur');
            $table->string('client');
            $table->json('produit');
            $table->string('payment');
            $table->json('tc');
            $table->json('avance');
            $table->integer('reste');
            $table->boolean('paye');
            $table->string('observation');
            $table->integer('created_by');
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
        Schema::dropIfExists('ventes');
    }
}
