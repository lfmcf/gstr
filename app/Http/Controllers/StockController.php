<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\InternProduct;
use App\Models\Seller;
use App\Models\movement;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Stock::all();
        return Inertia::render('stock/index', [
            'data' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $produit = InternProduct::where('quantite', '>', 0)->get();
        $vendeur = Seller::all()->except(3);
        return Inertia::render('stock/create', [
            'pro' => $produit,
            'vendeur' => $vendeur
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {


        $stock = Stock::where('vendeur', $request->vendeur)->first();
        if ($stock) {
            $products = $stock->product;

            foreach ($request->product as $rp) {
                foreach ($products as $key => $sp) {
                    if ($sp['name'] == $rp['name']) {
                        $products[$key]['quantite'] = $sp['quantite'] + $rp['quantite'];
                    } else {
                        $products = [...$products, $rp];
                    }
                }
            }

            $stock->product = $products;
            $stock->save();
        } else {
            $stock = new Stock();
            $stock->vendeur = $request->vendeur;
            $stock->date = $request->date;
            $stock->product = $request->product;
            $stock->created_by = $request->created_by;
            $stock->save();
        }

        $pmove = [];

        foreach ($request->product as $p) {
            $name = explode(",", $p['name']);

            $produit = InternProduct::where('productName', '=',  $name[0])
                ->where('volume', trim($name[1]))
                ->first();

            $produit->quantite = $produit->quantite - $p['quantite'];
            array_push($pmove, ['nom' => $name[0], 'volume' => $name[1], 'prix' => $produit->price, 'quantite' => $produit->quantite, 'qaun' => $p['quantite']]);
            $produit->save();
        }

        $move = new movement();
        $move->from = 'magasin';
        $move->to = $request->vendeur;
        $move->product = $pmove;
        $move->created_by = auth()->user()->id;
        $move->save();

        return redirect('stock');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Stock  $stock
     * @return \Illuminate\Http\Response
     */
    public function show(Stock $stock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Stock  $stock
     * @return \Illuminate\Http\Response
     */
    public function edit(Stock $stock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Stock  $stock
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Stock $stock)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Stock  $stock
     * @return \Illuminate\Http\Response
     */
    public function destroy(Stock $stock)
    {
        //
    }
}
