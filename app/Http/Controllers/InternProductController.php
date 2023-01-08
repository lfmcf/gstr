<?php

namespace App\Http\Controllers;

use App\Models\InternProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InternProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $inpro = InternProduct::all();
        return Inertia::render('inproduct/index', [
            'inpro' => $inpro
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('inproduct/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'productName' => 'required',
            'reference' => 'required',
            'volume' => 'required|regex:/^[A-z0-9 .]+$/',
            'price' => 'required',
            'quantite' => 'required',
            'date' => 'required'
        ]);
        InternProduct::create($request->all());
        return redirect('inproduct');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\InternProduct  $internProduct
     * @return \Illuminate\Http\Response
     */
    public function show(InternProduct $internProduct)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\InternProduct  $internProduct
     * @return \Illuminate\Http\Response
     */
    public function edit(InternProduct $internProduct, Request $request)
    {
        $inpro = InternProduct::findOrFail($request->id);
        return Inertia::render('inproduct/edit', [
            'inpro' => $inpro
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\InternProduct  $internProduct
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $internProduct = InternProduct::find($request->id);
        $internProduct->productName = $request->productName;
        $internProduct->reference = $request->reference;
        $internProduct->volume = $request->volume;
        $internProduct->price = $request->price;
        $internProduct->quantite = $request->quantite;
        
        $internProduct->save();
        return redirect('inproduct');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\InternProduct  $internProduct
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        foreach($request->ids as $id) {
            InternProduct::find($id)->delete($id);
        }
        return redirect('inproduct');
    }
}
