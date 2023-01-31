import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Bread from '@/Components/Bread';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MUIDataTable from "mui-datatables";
import {TableContainer, Table, TableBody, TableCell, TableRow, TableHead, TablePagination} from '@mui/material'
import moment from 'moment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Select from 'react-select';
import TableFooter from "@mui/material/TableFooter";

export default function Dashboard(props) {

    
    const [siarr, setSiarr] = useState([])
    const [siarrv, setSiarrv] = useState([])
    const [payment, setPayement] = useState('Tous')
    const [from, setFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1 ));
    const [to, setTo] = useState(new Date());
    const [fromv, setFromv] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1 ));
    const [tov, setTov] = useState(new Date());
    const [totalsomme, setTotalsomme] = useState();
    const [totalbeni, setTotalbeni] = useState();
    const totalcredit = props.clt.reduce((prev, next) => prev + next.reste, 0);

    const handleSelectChange = (selectedOption, name) => {
        setPayement(selectedOption.value)
    }

    const handleClick = () => {
       
        axios.post(route('getsituation'), { "from": from, 'to': to, 'payment': payment }).then(res => {
            
            var arr = [];
            for (const key in res.data) {
                
                var som = 0;
                var prix = 0, quan = 0, beni = 0;
                res.data[key].forEach(item => {
                    
                    item.produit.forEach(element => {
                        if (element.name == key) {
                            som += parseInt(element.somme)
                            prix = element.prixAchat
                            quan += parseInt(element.quantite)
                        }
                        beni = som - (prix * quan)
                    });
                });
               
                arr.push({
                    'name': key,
                    'ventes': quan,
                    'somme': som,
                    'prix': prix,
                    'benifice': beni
                })
            }
            setSiarr(arr)
        })
    }

    const handleClickV = () => {
        axios.post(route('getsituationv'), { "fromv": fromv, 'tov': tov }).then(res => {
            var arr = [];
            console.log(res.data)
            for (const key in res.data) {
                arr.push({
                    'name': key,
                    'ventes': res.data[key].length,
                    // 'somme': som,
                    // 'prix': prix,
                    // 'benifice': beni
                })
            }
            setSiarrv(arr)
        })
    }

    React.useEffect(() => {
        
        const totalvente = siarr.reduce((prev, next) => prev + next.somme, 0);
        const totalbenife = siarr.reduce((prev, next) => prev + next.benifice, 0);
        setTotalsomme(totalvente)
        setTotalbeni(totalbenife)
    }, [siarr])

    React.useEffect(() => {
        var arr = [], arrv = [];
        for (const key in props.situation) {
            var som = 0;
            var prix = 0, quan = 0, beni = 0;
            props.situation[key].forEach(item => {
                
                item.produit.forEach(element => {
                    if(element.name == key) {
                        som += parseInt(element.somme)
                        prix = element.prixAchat
                        quan += parseInt(element.quantite)
                        
                    }
                    beni = som - (prix * quan)
                });
                
            });
            
            arr.push({
                'name': key,
                'ventes': quan,
                'somme': som,
                'prix': prix,
                'benifice': beni
            })
        }
        setSiarr(arr)
        
        for (const key in props.situationv) {
            arrv.push({
                'name': key,
                'ventes': props.situationv[key].length,
                // 'somme': som,
                // 'prix': prix,
                // 'benifice': beni
            })
        }
        setSiarrv(arrv)
    }, []);

    const columns = [
        {
            name: 'id',
            options: {
                display: false,
                filter: false,
                viewColumns: false,
                sort: true,
            }
        },
        {
            name:"client",
            label: "Client",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"bon",
            label: "Bon n°",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"payment",
            label: "Payement",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
    ]
    const options = {
        rowsPerPageOptions: [5,10,15, 50, 100],
        rowsPerPage: 5,
        responsive: 'vertical',
        enableNestedDataAccess: '.',
        downloadOptions: {
            separator: ";",
            filterOptions: {
                useDisplayedColumnsOnly: false,
                useDisplayedRowsOnly: false
            }
        },
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const dataValues = props.echeance.find(x => x.id === rowData[0])
            return (
                <>
                <tr>
                    <td colSpan={7}>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Numero</TableCell>
                                        <TableCell>Date payement</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataValues.tc.map((p, index) => (
                                        <TableRow key={index}>
                                            {p.numero ? 
                                            <>
                                            <TableCell component="th" scope="row">{p.numero}</TableCell>
                                            <TableCell component="th" scope="row">{moment(p.date).format('DD/MM/YYYY')}</TableCell>
                                            </>
                                            : '' }
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </td>
                </tr>
                </>
            )
        }
    }

    const columnsc = [
        {
            name: 'id',
            options: {
                display: false,
                filter: false,
                viewColumns: false,
                sort: true,
            }
        },
        {
            name:"bon",
            label: "Bon n°",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"client",
            label: "Client",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"payment",
            label: "Payement",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        // {
        //     name:"avance",
        //     label: "Avance",
        //     options: {
        //         filter: true,
        //         filterType: 'multiselect',
        //     }
        // },
        {
            name:"reste",
            label: "Reste",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
    ]

    const optionscredit = {
        rowsPerPage: 5,
        responsive: 'vertical',
        enableNestedDataAccess: '.',
        downloadOptions: {
            separator: ";",
            filterOptions: {
                useDisplayedColumnsOnly: false,
                useDisplayedRowsOnly: false
            }
        },
        customFooter: (count, page, rowsPerPage ,  changeRowsPerPage, changePage) => {
            return (
                <TableFooter>
                  <TableRow>
                    <TableCell>Le total des restes est: {totalcredit}</TableCell>
                  </TableRow>
                  <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            count={count}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={event => changeRowsPerPage(event.target.value)}
                            onPageChange={(_, page) => changePage(page)}
                        />
                  </TableRow>
                </TableFooter>
            );
        }
    }

    const optionSituationM = {
        rowsPerPageOptions: [5,10,15, 50, 100],
        rowsPerPage: 5,
        responsive: 'vertical',
        enableNestedDataAccess: '.',
        downloadOptions: {
            separator: ";",
            filterOptions: {
                useDisplayedColumnsOnly: false,
                useDisplayedRowsOnly: false
            }
        },
        customFooter: (count, page, rowsPerPage ,  changeRowsPerPage, changePage) => {
            return (
                <TableFooter>
                  <TableRow>
                    <TableCell>Le total des sommes est: {totalsomme}</TableCell>
                    <TableCell>Le total de benifice est: {totalbeni}</TableCell>
                  </TableRow>
                  <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={count}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={event => changeRowsPerPage(event.target.value)}
                            onPageChange={(_, page) => changePage(page)}
                        />
                  </TableRow>
                </TableFooter>
            );
        }
    }

    const columnss = [
        {
            name: 'id',
            options: {
                display: false,
                filter: false,
                viewColumns: false,
                sort: true,
            }
        },
        {
            name: "name",
            label: "Nom",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name: "ventes",
            label: "Ventes",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name: "prix",
            label: "Prix d'achat",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name: "somme",
            label: "Somme",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
       
        {
            name: "benifice",
            label: "benifice",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
    ]

    const optionv = {
        rowsPerPageOptions: [5,10,15, 50, 100],
        rowsPerPage: 5,
        responsive: 'vertical',
        enableNestedDataAccess: '.',
        downloadOptions: {
            separator: ";",
            filterOptions: {
                useDisplayedColumnsOnly: false,
                useDisplayedRowsOnly: false
            }
        },
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            var name = rowData[1]
            console.log(props.situationv[name])
            return (
                <>
                <tr>
                    <td colSpan={7}>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom</TableCell>
                                        <TableCell>Quantité</TableCell>
                                        <TableCell>Prix de vente</TableCell>
                                        <TableCell>Somme</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.situationv[name].map((pro) => (
                                        pro.produit.map(p => (
                                            <TableRow >
                                                <TableCell component="th" scope="row">{p.name}</TableCell>
                                                <TableCell component="th" scope="row">{p.quantite}</TableCell>
                                                <TableCell component="th" scope="row">{p.prix}</TableCell>
                                                <TableCell component="th" scope="row">{p.somme}</TableCell>
                                            </TableRow>
                                        ))
                                    ))
                                    }
                                   
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </td>
                </tr>
                </>
            )
        }
    }

    const columnv = [
        {
            name: 'id',
            options: {
                display: false,
                filter: false,
                viewColumns: false,
                sort: true,
            }
        },
        {
            name: "name",
            label: "Nom",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name: "ventes",
            label: "Ventes",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
    ]

    

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <Bread title="Dashboard" />
            <div style={{marginTop: '20px'}}>
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        <div className='caro' style={{background: 'linear-gradient(-135deg, #899FD4 0%, #A389D4 100%)'}}>
                            <Typography>{props.cntpin} Produits Interne</Typography>
                        </div>
                    </Grid>
                    <Grid item md={3}>
                        <div className='caro' style={{ background: 'linear-gradient(-135deg, #1de9b6 0%, #1dc4e9 100%)'}}>
                            <Typography>{props.cntpex} Produits Externe</Typography>
                        </div>
                    </Grid>
                    <Grid item md={3}>
                        <div className='caro' style={{ background: 'linear-gradient(-135deg, #bdc3c7  0%, #2c3e50 100%)'}}>
                            <Typography>{props.clits} Clients</Typography>
                        </div>
                    </Grid>
                    <Grid item md={3}>
                        <div className='caro' style={{ background: 'linear-gradient(-135deg, #f27781  0%, #ed4264 100%)'}}>
                            <Typography>{props.vnts} Ventes</Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '10px' }}>
                    <Grid item md={12}>
                        <Typography style={{ marginBottom: '10px' }}>Caise</Typography>
                        <Paper style={{padding:'10px'}}>
                            <div>
                                <p>Total : {props.total} dh</p>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '10px' }}>
                    <Grid item md={12}>
                        <Typography style={{ marginBottom: '10px' }}>Echéance</Typography>
                        <MUIDataTable
                            data={props.echeance}
                            columns={columns}
                            options={options}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '10px' }}>
                    <Grid item md={12}>
                        <Typography style={{ marginBottom: '10px' }}>Crédit</Typography>
                        <MUIDataTable
                            data={props.clt}
                            columns={columnsc}
                            options={optionscredit}
                        />
                    </Grid>
                </Grid>
                
                <Grid container spacing={2} style={{ marginTop:'10px', marginBottom:'10px' }}>
                    <Grid item md={12}>
                        <Typography style={{ marginBottom: '10px' }}>Situation Mensuelle</Typography>
                    </Grid>
                    <Grid item md={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Du"
                                value={from}
                                inputFormat="dd/MM/yyyy"
                                onChange={(newValue) => {
                                    setFrom(newValue);
                                }}
                                renderInput={(params) => <TextField size='small' {...params} fullWidth />}
                                
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Au"
                                value={to}
                                inputFormat="dd/MM/yyyy"
                                onChange={(newValue) => {
                                    setTo(newValue);
                                }}
                                renderInput={(params) => <TextField size='small' {...params} fullWidth />}
                                
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={3}>
                        <Select options={[
                            { label: 'Tous', value: 'Tous' },
                            { label: 'Traite', value: 'Traite' },
                            { label: 'Chèque', value: 'Chèque' },
                            { label: 'Crédit', value: 'Crédit' },
                            { label: 'Espèce', value: 'Espèce' },
                        ]}
                            name='payment'
                            placeholder='Payment'
                            isClearable
                            onChange={handleSelectChange}
                            className="basic"
                            classNamePrefix="basic"
                            defaultValue={{label: payment, value: payment}}
                        />
                    </Grid>
                    <Grid item md={2}>
                        <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <Button variant="outlined" onClick={handleClick}>Chercher</Button>
                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <MUIDataTable
                            data={siarr}
                            columns={columnss}
                            options={optionSituationM}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop:'10px', marginBottom:'10px' }}>
                    <Grid item md={12}>
                        <Typography style={{ marginBottom: '10px' }}>Situation Mensuelle par vendeur</Typography>
                    </Grid>
                    <Grid item md={5}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Du"
                                value={fromv}
                                inputFormat="dd/MM/yyyy"
                                onChange={(newValue) => {
                                    setFromv(newValue);
                                }}
                                renderInput={(params) => <TextField size='small' {...params} fullWidth />}
                                
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={5}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Au"
                                value={tov}
                                inputFormat="dd/MM/yyyy"
                                onChange={(newValue) => {
                                    setTov(newValue);
                                }}
                                renderInput={(params) => <TextField size='small' {...params} fullWidth />}
                                
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={2}>
                        <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <Button variant="outlined" onClick={handleClickV}>Chercher</Button>
                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <MUIDataTable
                            data={siarrv}
                            columns={columnv}
                            options={optionv}
                        />
                    </Grid>
                </Grid>
            </div>
        </Authenticated>
    );
}
