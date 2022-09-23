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
use Illuminate\Support\Facades\Auth;


use function PHPUnit\Framework\isNull;

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
       
        $total = 0;
        foreach ($caise as $cs) {
            if($cs->paye){
                foreach($cs->produit as $p) {
                    $total += intval($p['somme']); 
                }
            }else{
                foreach($cs->avance as $av) {
                    $total += intval($av['montant']); 
                }
            }
            
        }

        foreach($charge as $ch) {
            $total = $total - $ch->montant;
        }

        $from = date('Y-m-01');
        $to = date('Y-m-d');
        $situation = $this->getSituation($from, $to, 'Tous');

        if(Auth::user()->role == "admin") {
            
            $situationv = $this->getSituationven($from, $to);
            return Inertia::render('Dashboard', [
                'echeance' => $echeance,
                'cntpex' => $cntpex,
                'cntpin' => $cntpin,
                'clits' => $clits,
                'vnts' => $vnts,
                'clt' => $clt,
                'total' => $total,
                'situation' => $situation,
                'situationv' => $situationv,
            ]);
        }else {
            return Inertia::render('UserDash', [
                'vnts' => $vnts,
                'cntpex' => $cntpex,
                'cntpin' => $cntpin,
                'clits' => $clits,
                'total' => $total,
                'situation' => $situation,
            ]);
        }
        
       
        
        // return view('dashboard', compact('echeance', 'cntpex', 'cntpin', 'clits', 'vnts', 'clt', 'total', 'situation'));
    }

    public function situation(Request $request) {
       
       $situation = $this->getSituation(date("y-m-d", strtotime($request->from)), date("y-m-d", strtotime($request->to)), $request->payment);
       return response()->json($situation);
    }

    public function situationv(Request $request) {
        
        $situationv = $this->getSituationven(date("y-m-d", strtotime($request->fromv)), date("y-m-d", strtotime($request->tov)));
        return response()->json($situationv);
     }

    public function getSituation($from, $to, $pay) 
    {
        
        if($pay == 'Tous'|| $pay == '') {
            $situation = Vente::whereBetween('date', [$from, $to])
            ->get()->groupBy('produit.*.name');
        }elseif($pay == 'Traite') {
            
            $situation = Vente::whereBetween('date', [$from, $to])
            ->where('payment', '=', 'Traite')
            ->get()->groupBy('produit.*.name');
        }
        elseif($pay == 'Chèque') {
            $situation = Vente::whereBetween('date', [$from, $to])
            ->where('payment', $pay)
            ->get()->groupBy('produit.*.name');
        }elseif($pay == 'Crédit') {
            $situation = Vente::whereBetween('date', [$from, $to])
            ->where('payment', $pay)
            ->get()->groupBy('produit.*.name');
        }elseif($pay == 'Espèce') {
            $situation = Vente::whereBetween('date', [$from, $to])
            ->where('payment', $pay)
            ->get()->groupBy('produit.*.name');
        }
       
        foreach($situation as $key => $value) {
            
            foreach($situation[$key] as $si){
                $arr = [];
                foreach($si->produit as $p) {
                    
                    $name = explode(",", $p['name']);
                    if (count($name) > 1) {
                        $pro = InternProduct::where('productName', '=',  $name[0])
                            ->where('volume', trim($name[1]))->first();
                    } else {
                        $pro = ExternProduct::where('productName', '=',  $name[0])->first();
                    }
                   
                    $p['prixAchat'] = $pro->price;
                    array_push($arr, $p);
                }
                $si->produit = $arr;
            }

            // $name = explode(",", $key);
            
            // if(count($name) > 1) {
            //     $pro = InternProduct::where('productName', '=',  $name[0])
            //     ->where('volume', trim($name[1]))->first();
            // }
            // else {
            //     $pro = ExternProduct::where('productName', '=',  $name[0])->first();
            // }

            // foreach($situation[$key] as $si){
            //     $si->prixAchat = $pro->price;
            // }
        }
       
        return $situation;
    }

    public function getSituationven($from, $to) 
    {
        $situationve = Vente::whereBetween('date', [$from, $to])
        ->get()->groupBy('vendeur');

        foreach($situationve as $key => $value) {
            
            foreach($situationve[$key] as $si){
                $arr = [];
                foreach($si->produit as $p) {
                    
                    $name = explode(",", $p['name']);
                    if (count($name) > 1) {
                        $pro = InternProduct::where('productName', '=',  $name[0])
                            ->where('volume', trim($name[1]))->first();
                    } else {
                        $pro = ExternProduct::where('productName', '=',  $name[0])->first();
                    }
                   
                    $p['prixAchat'] = $pro->price;
                    array_push($arr, $p);
                }
                $si->produit = $arr;
            }
        }
        return $situationve;
    }
}
