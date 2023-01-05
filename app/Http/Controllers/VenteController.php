<?php

namespace App\Http\Controllers;

use App\Models\Vente;
use App\Models\ExternProduct;
use App\Models\InternProduct;
use App\Models\client;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use DateTime;

class VenteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $vente = Vente::all();
        return Inertia::render('vente/index', [
            'vente' => $vente
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $exproduit = collect(ExternProduct::all());
        $enproduit = collect(InternProduct::all());
        $produit = $exproduit->merge($enproduit);
        
        $clinet = client::all();
       
        $vendeur = Seller::all();

        return Inertia::render('vente/create', [
            'pro' => $produit,
            'client' => $clinet,
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
        $this->validate(request(),
            [
                'date' => 'required',
                'vendeur' => 'required',
                'client' => 'required',
                'produit.*.name' => 'required',
                'produit.*.quantite' => [function ($attribute, $value, $fail) {

                    if (!$value) {
                        $fail(' ');
                    }
                    $nom = explode(".", $attribute);
                    $pro = request()->produit[$nom[1]];
                    // dd($pro);
                    if($pro['name']) {
                        $name = explode(",", $pro['name']);
                        $date = str_replace('/', '-', trim($name[3]));
                        $EndDate = strtotime($date);
                        if (count($name) > 1) {
                            $product = InternProduct::where('productName', '=',  $name[0])
                            ->where('volume', trim($name[1]))
                            ->where('reference', trim($name[2]))
                            ->whereDate('date', date('Y-m-d', $EndDate))
                            ->first();
                        } else {
                            $product = ExternProduct::where('productName', '=',  $name[0])->first();
                        }
                        $check = $product->quantite < $value ? true : false;
    
                        if ($check) {
                            $fail('la quantité de produit est supérieure à celle du stock'); // error massage
                        }else {
                            $product->quantite = $product->quantite - $value;
                            $product->save();
                        }
                    }
                  }],
                'produit.*.prix' => 'required',
                'payment' => 'required',
                'avance.*.montant' => 'required'
            ]
            
        );
        $vent = new Vente();
        $vent->bon = $request->bon;
        $vent->date = date('Y-m-d H:i:s', strtotime($request->date));
        $vent->vendeur = $request->vendeur;
        $vent->client = $request->client;
        $vent->produit = $request->produit;
        $vent->payment = $request->payment;
        $vent->avance = $request->avance;
        $vent->reste = $request->reste;
        $vent->paye = $request->paye;
        $vent->observation = $request->observation;
        $vent->created_by = Auth::user()->id;

        // foreach($request->produit as $pro) {
            
        //     $name = explode(",", $pro['name']);
        //     if(count($name) > 1) {
        //         $product = InternProduct::where('productName', '=',  $name[0])
        //         ->where('volume', trim($name[1]))->first();
        //     }
        //     else {
        //         $product = ExternProduct::where('productName', '=',  $name[0])->first();
        //     }
        //     if($product->quantite < $pro['quantite']) {
        //         return back()->with('message', 'la quantité de produit' . $product->name . 'sélectionnée est supérieure à celle du stock');
        //     } else {
        //         $product->quantite = $product->quantite - $pro['quantite'];
        //         $product->save();
        //     }
            
        // }
        

        $docs = $request->tc;

        if(!empty($docs)) {
            $arr = array_map(function($doc) {
                if ($doc['document'] && gettype($doc['document']) != 'string') {
                    $uploadedFile = $doc['document'];
                    $filename = time() . $uploadedFile->getClientOriginalName();
                    $path = Storage::putFileAs(
                        'public',
                        $uploadedFile,
                        $filename
                    );
                    $doc['document'] = asset('storage/'.$filename);
                }
                return $doc;
            }, $docs);
            $docs = $arr;
        }

        $vent->tc = $docs;
        
        $vent->save();
        return redirect('vente')->with('message', 'Vente ajouté avec success');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Vente  $vente
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $vent = Vente::find($request->id); 
        return Inertia::render('vente/show', [
            'vente' => $vent
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Vente  $vente
     * @return \Illuminate\Http\Response
     */
    public function edit(Vente $vente, Request $request)
    {
        $vente = Vente::find($request->id);
        $exproduit = collect(ExternProduct::all());
        $enproduit = collect(InternProduct::all());
        $produit = $exproduit->merge($enproduit);
        $clinet = client::all();
        $vendeur = Seller::all();

        return Inertia::render('vente/edit', [
            'vente' => $vente,
            'pro' => $produit,
            'client' => $clinet,
            'vendeur' => $vendeur
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Vente  $vente
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Vente $vente)
    {
        
        $vent = Vente::find($request->id);
        $vent->bon = $request->bon;
        $vent->date = date('Y-m-d H:i:s', strtotime($request->date));
        $vent->vendeur = $request->vendeur;
        $vent->client = $request->client;
        $vent->produit = $request->produit;
        $vent->payment = $request->payment;
        $vent->avance = $request->avance;
        $vent->reste = $request->reste;
        $vent->paye = $request->paye;
        $vent->observation = $request->observation;
        $vent->created_by = Auth::user()->id;

        $docs = $request->tc;

        if(!empty($docs)) {
            $arr = array_map(function($doc) {
                if ($doc['document'] && gettype($doc['document']) != 'string') {
                    $uploadedFile = $doc['document'];
                    $filename = time() . $uploadedFile->getClientOriginalName();
                    $path = Storage::putFileAs(
                        'public',
                        $uploadedFile,
                        $filename
                    );
                    $doc['document'] = asset('storage/'.$filename);
                }
                return $doc;
            }, $docs);
            $docs = $arr;
        }

        $vent->tc = $docs;
        
        $vent->save();
        return redirect('vente');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Vente  $vente
     * @return \Illuminate\Http\Response
     */
    public function destroy(Vente $vente, Request $request)
    {
        foreach($request->ids as $id) {
            Vente::find($id)->delete($id);
        }
        
        return redirect('vente')->with('message', 'suppression avec success');
    }

    public function getavance(Request $request) 
    {
        $vent = Vente::findOrFail($request->id);
        return Inertia::render('vente/avance', [
            'vente' => $vent->id
        ]);
    }

    public function updateAvance(Request $request) {
        
        $vent = Vente::find($request->id);
        $avance = $vent->avance;
        array_push($avance, ['date' => $request->date, 'montant' => $request->montant]);
        $vent->avance = $avance;
        $vent->save();
        return redirect('vente');
    }
}
