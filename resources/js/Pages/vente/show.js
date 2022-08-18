import React from "react";
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Bread from '@/Components/Bread';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';

export default function show(props) {

    const { vente } = props
    console.log(vente.avance)

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Ventes" />
            <Bread title="Ventes" />
            <div>
                <div className="venteBlock">

                    <Typography component='h4' style={{marginRight:'10px'}}>Bon n° :</Typography>
                    <Typography component='p' variant='subtitle2'> {vente.bon}</Typography>
                </div>
                <div className="venteBlock">
                    <Typography component='h4' style={{marginRight:'10px'}}>Vendeur :</Typography>
                    <Typography component='p' variant='subtitle2'> {vente.vendeur}</Typography>
                </div>
                <div className="venteBlock">
                    <Typography component='h4' style={{marginRight:'10px'}}>Client :</Typography>
                    <Typography component='p' variant='subtitle2'> {vente.client}</Typography>
                </div>
                <div className="venteBlock">
                    <Typography component='h4' style={{marginRight:'10px'}}>Date :</Typography>
                    <Typography component='p' variant='subtitle2'> {moment(vente.date).format('DD/MM/YYYY')}</Typography>
                </div>
                <div className="venteBlock">
                    <Typography component='h4' style={{marginRight:'10px'}}>Payement :</Typography>
                    <Typography component='p' variant='subtitle2'> {vente.payment}</Typography>
                </div>
                <div style={{marginBottom:'10px'}}>
                    {vente.payment == 'Chèque' || vente.payment == 'Traite' ?
                    <table className="ventShow">
                        <thead>
                            <tr>
                                <th>Numero</th>
                                <th>Date</th>
                                <th>Document</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vente.tc.map(vt => (
                                <tr>
                                    <td>{vt.numero}</td>
                                    <td>{moment(vt.date).format('DD/MM/YYYY')}</td>
                                    <td>
                                        <IconButton size="small" aria-label="show">
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton size="small" aria-label="Telecharger">
                                            <DownloadIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : ''}
                </div>
                <div style={{paddingBottom:'10px'}}>
                    <Typography component='h4' style={{marginBottom:'10px'}}>Produit(s) :</Typography>
                    <table className="ventShow">
                        <thead>
                            <tr>
                                <th>Nom produit</th>
                                <th>Prix</th>
                                <th>Quantité</th>
                                <th>Somme</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vente.produit.map(pro => (
                                <tr>
                                    <td>{pro.name}</td>
                                    <td>{pro.prix}</td>
                                    <td>{pro.quantite}</td>
                                    <td>{pro.somme}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{paddingBottom:'10px'}}>
                    <Typography component='h4' style={{marginBottom:'10px'}}>Avance(s) :</Typography>
                    <table className="ventShow">
                        <thead>
                            <tr>
                                <th>Montant</th>
                                <th>Date</th>

                            </tr>
                        </thead>
                        <tbody>
                            {vente.avance.map(av => (
                                <tr>
                                    <td>{av.montant} dh</td>
                                    <td>{av.date ? moment(av.date).format('DD/MM/YYYY') : moment(vente.date).format('DD/MM/YYYY')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="venteBlock">
                    <Typography component='h4' style={{marginRight:'10px'}}>Observation :</Typography>
                    <Typography component='p' variant='subtitle2'> {vente.observation}</Typography>
                </div>
            </div>
        </Authenticated>
    )
}