import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Bread from '@/Components/Bread';
import { Head } from '@inertiajs/inertia-react';
import { Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment'
import Button from '@mui/material/Button';
import { Inertia } from '@inertiajs/inertia';

export default function show(props) {
    const { cn } = props
    const find = (id) => {
        Inertia.get(route('Editconteneurs', { 'id': id }))
    }
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Show</h2>}

        >
            <Head title="Show" />
            <Bread title="Show" />
            <div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                    <Typography style={{ marginRight: '10px' }}>Nom : </Typography>
                    <Typography variant='p'>{cn.nom}</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                    <Typography style={{ marginRight: '10px' }}>Date : </Typography>
                    <Typography variant='p'>{moment(cn.date).format('DD-MM-yyyy')}</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                    <Typography style={{ marginRight: '10px' }}>Description : </Typography>
                    <Typography variant='p'>{cn.description}</Typography>
                </div>
                <div style={{ margin: '10px 0' }}>
                    <Typography>Produits :  </Typography>
                    <div style={{ margin: '10px 0' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom</TableCell>
                                        <TableCell align="right">Voluome</TableCell>
                                        <TableCell align="right">Prix</TableCell>
                                        <TableCell align="right">Quantité</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cn.product.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.nom}
                                            </TableCell>
                                            <TableCell align="right">{row.volume}</TableCell>
                                            <TableCell align="right">{row.prix}</TableCell>
                                            <TableCell align="right">{row.quantite}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
            <Button variant='outlined' onClick={() => find(cn.id)}>Modifier</Button>
        </Authenticated >
    )
}