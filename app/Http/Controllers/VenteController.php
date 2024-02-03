<?php

namespace App\Http\Controllers;

use App\Models\Vente;
use App\Models\ExternProduct;
use App\Models\InternProduct;
use App\Models\client;
use App\Models\Seller;
use App\Models\Stock;
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

    public $product = [];

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
        // $exproduit = collect(ExternProduct::all());
        $produit = InternProduct::where('quantite', '>', 0)->get();
        // $produit = $exproduit->merge($enproduit);

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

        $this->validate(
            request(),
            [
                'bon' => 'required|unique:ventes',
                'date' => 'required',
                'vendeur' => 'required',
                'client' => 'required',
                'produit.*.name' => 'required',
                'produit.*.prix' => 'required',
                'payment' => 'required',
                'avance.*.montant' => 'required',
                // 'produit.*.quantite' => [function ($attribute, $value, $fail) {

                //     if (!$value) {
                //         $fail(' ');
                //     }

                //     $nom = explode(".", $attribute);

                //     $pro = request()->produit[$nom[1]];
                //     $fpro = $pro['name'];
                //     if($fpro) {
                //         $name = explode(",", $fpro);

                //         $date = str_replace('/', '-', trim($name[3]));

                //         $EndDate = strtotime($date);

                //         if (count($name) > 1) {
                //             $produit = InternProduct::where('productName', '=',  $name[0])
                //             ->where('volume', trim($name[1]))
                //             ->where('reference', trim($name[2]))
                //             ->whereDate('date', date('Y-m-d', $EndDate))
                //             ->first();
                //         }

                //         $check = $produit->quantite < $value ? true : false;

                //         if ($check) {
                //             $fail('la quantité de produit est supérieure à celle du stock'); // error massage
                //         }else {
                //             $produit->quantite = $produit->quantite - $value;
                //             // $produit->save();
                //             array_push($this->product, $produit);
                //         }
                //     }
                // }],
            ]
        );

        if ($request->vendeur == 'MAGASIN RAJAE') {
            foreach ($request->produit as $p) {
                $name = explode(",", $p['name']);
                $produit = InternProduct::where('productName', $name[0])->where('volume', trim($name[1]))->first();
                $produit->quantite = $produit->quantite - $p['quantite'];
                $produit->save();
            }
        } else {
            $stock = Stock::where('vendeur', $request->vendeur)->first();

            $sproduct = $stock->product;
            foreach ($request->produit as $p) {
                foreach ($sproduct as $key => $sp)
                    if ($p['name'] == $sp['name']) {
                        $sproduct[$key]['quantite'] = $sp['quantite'] - $p['quantite'];
                    }
            }

            $stock->product = $sproduct;
            $stock->save();
        }



        // foreach ($this->product as $value) {
        //     if ($value instanceof InternProduct) {
        //         $value->save();
        //     }
        // }

        // $datapro = [];
        // foreach($request->produit as $dpro) {
        //     array_push($datapro, ['name' => $dpro['name']['value'], 'somme' => $dpro['somme'], 'prix' => $dpro['prix'], 'quantite' => $dpro['quantite']]);
        // }

        // dd($datapro);

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

        if (!empty($docs)) {
            $arr = array_map(function ($doc) {
                if ($doc['document'] && gettype($doc['document']) != 'string') {
                    $uploadedFile = $doc['document'];
                    $filename = time() . $uploadedFile->getClientOriginalName();
                    $path = Storage::putFileAs(
                        'public',
                        $uploadedFile,
                        $filename
                    );
                    $doc['document'] = asset('storage/' . $filename);
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
        // $exproduit = collect(ExternProduct::all());
        // $enproduit = collect(InternProduct::all());
        // $produit = $exproduit->merge($enproduit);
        $produit = InternProduct::where('quantite', '>', 0)->get();
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

        if ($vent->isDirty('produit')) {
            $original = $vent->getOriginal('produit');

            $new = $vent->produit;
            $nameToAdd = [];
            $nameToRemove = [];
            $nameToCheck = [];
            foreach ($new as $gr) {
                if ($pos = array_search($gr['name'], array_column($original, 'name')) === false) {
                    array_push($nameToAdd, ['name' => $gr['name'], 'quantite' => $gr['quantite']]);
                } else {
                    array_push($nameToCheck, $gr);
                }
            }
            foreach ($original as $g) {
                if (array_search($g['name'], array_column($new, 'name')) === false) {
                    array_push($nameToRemove, ['name' => $g['name'], 'quantite' => $g['quantite']]);
                }
            }

            if ($nameToCheck) {
                foreach ($nameToCheck as $eletocheck) {
                    $pos = array_search($eletocheck, $original);
                    if ($original[$pos]['quantite'] != $eletocheck['quantite'] || $original[$pos]['prix'] !=  $eletocheck['prix']) {
                        $pro = $eletocheck['name'];
                        $name = explode(",", $pro);
                        $date = str_replace('/', '-', trim($name[3]));
                        $EndDate = strtotime($date);
                        $produit = InternProduct::where('productName', '=',  $name[0])
                            ->where('volume', trim($name[1]))
                            ->where('reference', trim($name[2]))
                            ->whereDate('date', date('Y-m-d', $EndDate))
                            ->first();
                        if ($original[$pos]['quantite'] > $eletocheck['quantite']) {
                            $quan = $original[$pos]['quantite'] - $eletocheck['quantite'];
                            $produit->quantite = $produit->quantite + $quan;
                            $produit->save();
                            $new[$pos]['prix'] = $eletocheck['prix'];
                        } else {
                            $quan = $eletocheck['quantite'] - $original[$pos]['quantite'];
                            if ($produit->quantite > $quan) {
                                $produit->quantite = $produit->quantite - $quan;
                            } else {
                                return back()->withErrors([$eletocheck['name'] => "la quantité de produit est supérieure à celle du stock"]);
                            }
                            $produit->save();
                            $new[$pos]['prix'] = $eletocheck['prix'];
                        }
                    }
                }
            }

            if ($nameToAdd) {
                foreach ($nameToAdd as $eletoadd) {
                    $pro = $eletoadd['name'];
                    $name = explode(",", $pro);
                    $date = str_replace('/', '-', trim($name[3]));
                    $EndDate = strtotime($date);
                    $produit = InternProduct::where('productName', '=',  $name[0])
                        ->where('volume', trim($name[1]))
                        ->where('reference', trim($name[2]))
                        ->whereDate('date', date('Y-m-d', $EndDate))
                        ->first();
                    if ($produit->quantite > $eletoadd['quantite']) {
                        $produit->quantite = $produit->quantite - $eletoadd['quantite'];
                        $produit->save();
                    } else {
                        return back()->withErrors([$eletoadd['name'] => "la quantité de produit est supérieure à celle du stock"]);
                    }
                }
            }

            if ($nameToRemove) {
                foreach ($nameToRemove as $eletoremove) {
                    $pro = $eletoremove['name'];
                    $name = explode(",", $pro);
                    $date = str_replace('/', '-', trim($name[3]));
                    $EndDate = strtotime($date);
                    $produit = InternProduct::where('productName', '=',  $name[0])
                        ->where('volume', trim($name[1]))
                        ->where('reference', trim($name[2]))
                        ->whereDate('date', date('Y-m-d', $EndDate))
                        ->first();
                    $produit->quantite = $produit->quantite + $eletoadd['quantite'];
                    $produit->save();
                }
            }
        }

        $docs = $request->tc;

        if (!empty($docs)) {
            $arr = array_map(function ($doc) {
                if ($doc['document'] && gettype($doc['document']) != 'string') {
                    $uploadedFile = $doc['document'];
                    $filename = time() . $uploadedFile->getClientOriginalName();
                    $path = Storage::putFileAs(
                        'public',
                        $uploadedFile,
                        $filename
                    );
                    $doc['document'] = asset('storage/' . $filename);
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
        foreach ($request->ids as $id) {
            $vente = Vente::find($id);
            foreach ($vente->produit as $pro) {
                $name = explode(",", $pro['name']);
                $date = str_replace('/', '-', trim($name[3]));
                $EndDate = strtotime($date);
                $produit = InternProduct::where('productName', '=',  $name[0])
                    ->where('volume', trim($name[1]))
                    ->where('reference', trim($name[2]))
                    ->whereDate('date', date('Y-m-d', $EndDate))
                    ->first();
                $produit->quantite = $produit->quantite + $pro['quantite'];
                $produit->save();
                $vente->delete();
            }
            //Vente::find($id)->delete($id);
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

    public function updateAvance(Request $request)
    {

        $vent = Vente::find($request->id);
        $avance = $vent->avance;
        array_push($avance, ['date' => $request->date, 'montant' => $request->montant]);
        $vent->avance = $avance;
        $vent->save();
        return redirect('vente');
    }
}
