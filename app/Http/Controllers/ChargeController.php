<?php

namespace App\Http\Controllers;

use App\Models\Charge;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ChargeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $from = date('Y-m-01');
        $to = date('Y-m-d');
        $charge = Charge::whereBetween('date', [$from, $to])->get();
        return Inertia::render('charge/index', [
            'charge' => $charge
        ]);
    }

    public function getCharge(Request $request) {
        $charge = Charge::whereBetween('date', [date("y-m-d", strtotime($request->fromv)), date("y-m-d", strtotime($request->tov))])->get();
        return response()->json($charge);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('charge/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $charge = new Charge();
        $charge->operation = $request->operation;
        $charge->date = date('Y-m-d H:i:s', strtotime($request->date));
        $charge->montant = $request->montant;
        $charge->ref = $request->ref;
        $charge->created_by = $request->created_by;
        $charge->save();
        return redirect('charge')->with('message', 'Charge ajouté avec success');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Charge  $charge
     * @return \Illuminate\Http\Response
     */
    public function show(Charge $charge)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Charge  $charge
     * @return \Illuminate\Http\Response
     */
    public function edit(Charge $charge, Request $request)
    {
        $charge = Charge::findOrFail($request->id);
        return Inertia::render('charge/edit', [
            'charge' => $charge
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Charge  $charge
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Charge $charge)
    {
        $charge = Charge::find($request->id);
        $charge->operation = $request->operation;
        $charge->date = date('Y-m-d H:i:s', strtotime($request->date));
        $charge->montant = $request->montant;
        $charge->ref = $request->ref;
        $charge->save();
        return redirect('charge');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Charge  $charge
     * @return \Illuminate\Http\Response
     */
    public function destroy(Charge $charge, Request $request)
    {
        foreach($request->ids as $id) {
            Charge::find($id)->delete($id);
        }

        return redirect('charge');
    }
}
