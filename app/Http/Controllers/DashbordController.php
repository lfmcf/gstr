<?php

namespace App\Http\Controllers;

use App\Models\Charge;
use App\Models\client;
use App\Models\Dashboard;
use App\Models\ExternProduct;
use App\Models\InternProduct;
use App\Models\Vente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashbordController extends Controller
{
    public function index()
    {
        $cntpex = ExternProduct::count();
        $cntpin = InternProduct::count();
        $clits = client::count();
        $vnts = Vente::count();

        $echeance = Vente::where('payment', 'Traite')
                ->orWhere(function($query){
                    $query->where('payment', 'Chèque');
                })
                ->where('paye', false)
                ->get()
                ->sortBy(['created_at', 'DESC']);

        $clt = Vente::where('paye', false)->get();

        $caise = Vente::all();
        $charge = Charge::all();
        //dd($caise);
        $total = 0;
        foreach ($caise as $cs) {
            if($cs->paye){
                foreach($cs->produit as $p) {
                    $total = $total + intval($p['somme']); 
                }
            }else{
                foreach($cs->avance as $av) {
                    $total = $total + intval($av['montant']); 
                }
            }
            
        }

        foreach($charge as $ch) {
            $total = $total - $ch->montant;
        }

        $from = date('Y-m-01');
        $to = date('Y-m-t');
        $situation = $this->getSituation($from, $to);
        
        return Inertia::render('Dashboard', [
            'echeance' => $echeance,
            'cntpex' => $cntpex,
            'cntpin' => $cntpin,
            'clits' => $clits,
            'vnts' => $vnts,
            'clt' => $clt,
            'total' => $total,
            'situation' => $situation,
        ]);
        
        // return view('dashboard', compact('echeance', 'cntpex', 'cntpin', 'clits', 'vnts', 'clt', 'total', 'situation'));
    }

    public function situation(Request $request) {
       
       $situation = $this->getSituation(date("y-m-d", strtotime($request->from)), date("y-m-d", strtotime($request->to)));
       return response()->json($situation);
    }

    public function getSituation($from, $to) 
    {
        $situation = Vente::whereBetween('created_at', [$from, $to])
        ->get()->groupBy('produit.*.name');
        return $situation;
    }
}
