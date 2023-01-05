<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInternProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('intern_products', function (Blueprint $table) {
            $table->id();
            $table->string('productName');
            $table->string('reference');
            $table->string('volume');
            $table->integer('price');
            $table->integer('quantite');
            $table->integer('quantiteI');
            $table->dateTime('date');
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
        Schema::dropIfExists('intern_products');
    }
}
