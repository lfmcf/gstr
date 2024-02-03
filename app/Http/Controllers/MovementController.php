<?php

namespace App\Http\Controllers;

use App\Models\movement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MovementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $movement = movement::all();
        return Inertia::render('movement/index', [
            'data' => $movement
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\movement  $movement
     * @return \Illuminate\Http\Response
     */
    public function show(movement $movement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\movement  $movement
     * @return \Illuminate\Http\Response
     */
    public function edit(movement $movement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\movement  $movement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, movement $movement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\movement  $movement
     * @return \Illuminate\Http\Response
     */
    public function destroy(movement $movement)
    {
        //
    }
}
