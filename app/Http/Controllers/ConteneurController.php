<?php

namespace App\Http\Controllers;

use App\Models\Conteneur;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ConteneurController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $con = Conteneur::all();
        return Inertia::render('conteneur/index', [
            'data' => $con
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('conteneur/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $con = new Conteneur();
        $con->nom = $request->nom;
        $con->date = date('Y-m-d H:i:s', strtotime($request->date));
        $con->product = $request->produit;
        $con->created_by = $request->created_by;
        $con->description = $request->description;
        $con->save();
        return redirect('conteneurs')->with('message', 'Vente ajouté avec success');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Conteneur  $conteneur
     * @return \Illuminate\Http\Response
     */
    public function show(Conteneur $conteneur, Request $request)
    {
        $id = $request->query('id');
        $conteneur = Conteneur::where('id', $id)->first();
        return Inertia::render('conteneur/show', [
            'cn' => $conteneur
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Conteneur  $conteneur
     * @return \Illuminate\Http\Response
     */
    public function edit(Conteneur $conteneur, Request $request)
    {
        $id = $request->query('id');
        $conteneur = Conteneur::where('id', $id)->first();
        return Inertia::render('conteneur/edit', [
            'cn' => $conteneur
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Conteneur  $conteneur
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Conteneur $conteneur)
    {
        $con = Conteneur::where('id', $request->id)->first();
        $con->nom = $request->nom;
        $con->date = date('Y-m-d H:i:s', strtotime($request->date));
        $con->product = $request->produit;
        $con->created_by = $request->created_by;
        $con->description = $request->description;
        $con->save();
        return redirect('conteneurs')->with('message', 'Vente ajouté avec success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Conteneur  $conteneur
     * @return \Illuminate\Http\Response
     */
    public function destroy(Conteneur $conteneur)
    {
        //
    }

    public function products(Request $request)
    {
        $con = $request->con;
        $products = Conteneur::where('nom', $con)->get(['product']);
        return response($products, 200);
    }
}
