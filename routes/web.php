<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ChargeController;
use App\Http\Controllers\DashbordController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\InternProductController;
use App\Http\Controllers\ExternProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VenteController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::middleware(['auth', 'verified', 'admin'])->group(function () {

    Route::get('/dashboard', [DashbordController::class, 'index']);

    Route::get('/', [DashbordController::class, 'index']);

    Route::get('/inproduct', [InternProductController::class, 'index']);
    Route::get('/inproduct/create', [InternProductController::class, 'create'])->name("createInProduct");
    Route::post('/storeinproduct', [InternProductController::class, 'store'])->name("storeinproduct");
    Route::get('/inproduct/update/{id}', [InternProductController::class, 'edit'])->name("editInproduct");
    Route::post('/updateinproduct', [InternProductController::class, 'update'])->name('updateinproduct');
    Route::post('/deleteInproduct', [InternProductController::class, 'destroy'])->name('deleteInproduct');


    Route::get('/exproduct', [ExternProductController::class, 'index']);
    Route::get('/exproduct/create', [ExternProductController::class, 'create'])->name("createExProduct");
    Route::post('/storeexproduct', [ExternProductController::class, 'store'])->name("storeexproduct");
    Route::get('/exproduct/update/{id}', [ExternProductController::class, 'edit'])->name("editExproduct");
    Route::post('/updateexproduct', [ExternProductController::class, 'update'])->name('updateexproduct');
    Route::post('/deleteExproduct', [ExternProductController::class, 'destroy'])->name('deleteExproduct');

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/create', [UserController::class, 'create'])->name('createUser');
    Route::get('/users/update/{id}', [UserController::class, 'edit'])->name('editUser');
    Route::post('/storeuser', [UserController::class, 'store'])->name('storeUser');
    Route::post('/updateuser', [UserController::class, 'update'])->name('updateUser');
    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->middleware(['auth', 'verified'])->name('dashboard');

});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/charge', [ChargeController::class, 'index']);
    Route::get('/charge/create', [ChargeController::class, 'create'])->name("createCharge");
    Route::post('/storecharge', [ChargeController::class, 'store'])->name('storecharge');
    Route::get('/charge/update/{id}', [ChargeController::class, 'edit'])->name('editCharge');
    Route::post('/updateCharge', [ChargeController::class, 'update'])->name('updateCharge');

    Route::get('/client', [ClientController::class, 'index']);
    Route::get('/client/create', [ClientController::class, 'create'])->name("createClient");
    Route::post('/storeclient', [ClientController::class, 'store'])->name("storeClient");
    Route::get('/client/update/{id}', [ClientController::class, 'edit'])->name("editClient");
    Route::post('/updateClient', [ClientController::class, 'update'])->name('updateClient');
    Route::post('deleteClient', [ClientController::class, 'destroy'])->name('deleteClient');

    Route::get('/vendeur', [SellerController::class, 'index']);
    Route::get('/vendeur/create', [SellerController::class, 'create'])->name("createSeller");
    Route::post('/storeseller', [SellerController::class, 'store'])->name("storeseller");
    Route::get('/vendeur/update/{id}', [SellerController::class, 'edit'])->name('editSeller');
    Route::post('/updateseller', [SellerController::class, 'update'])->name("updateseller");
    Route::post('/deleteSeller', [SellerController::class, 'destroy'])->name("deleteSeller");

    Route::get('/vente', [VenteController::class, 'index']);
    Route::get('/vente/create', [VenteController::class, 'create'])->name("createVente");
    Route::post('/storevente', [VenteController::class, 'store'])->name("storevente");
    Route::get('/vente/update/{id}', [VenteController::class, 'edit'])->name('editVente');
    Route::post('/deleteVente', [VenteController::class, 'destroy'])->name("deleteVente");
    Route::get('/avance/{id}', [VenteController::class, 'getavance'])->name("avance");
    Route::post('/deleteVente', [VenteController::class, 'destroy'])->name("deleteVente");
    Route::post('/addAvance', [VenteController::class, 'updateAvance'])->name('addAvance');
});




require __DIR__ . '/auth.php';