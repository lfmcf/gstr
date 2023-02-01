import React, { useState, useEffect } from 'react';
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

    const [from, setFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1 ));
    const [to, setTo] = useState(new Date());
    const [payment, setPayement] = useState('Tous');
    const [siarr, setSiarr] = useState([]);
    const [total, setTotal] = useState();
    // const [page, setPage] = React.useState(0);
    // const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const totalcredit = props.clt.reduce((prev, next) => parseInt(prev) + parseInt(next.reste), 0);

    const handleSelectChange = (selectedOption, name) => {
        setPayement(selectedOption.value)
    }

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };

    const handleClick = () => {
        axios.post(route('getsituation'), { "from": from, 'to': to, 'payment': payment }).then(res => {
            var arr = [];
            
            for (const key in res.data) {
                var som = 0;
                var prix = 0, quan = 0, beni = 0;
                res.data[key].forEach(item => {
                    item.produit.forEach(element => {
                        if(element.name == key) {
                            som += parseInt(element.somme)
                            prix = element.prixAchat
                            quan += parseInt(element.quantite)
                            
                        }
                    });
                });
    
                arr.push({
                    'name': key,
                    'ventes': quan,
                    'somme': som,
                });
            }
            setSiarr(arr)
        })
    }


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
            name: "somme",
            label: "Somme",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
    ]

    useEffect(() => {
        const totalvente = siarr.reduce((prev, next) => prev + next.somme, 0);
        setTotal(totalvente)
    }, [siarr])

    // useEffect(() => {
    //     const totalcredit = siarr.reduce((prev, next) => prev + next.somme, 0);
    //     setTotalcredit(totalcredit)
    // }, [props.])

    const optionsc = {
        //rowsPerPageOptions: [5,10,15, 50, 100],
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
        customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
            return (
                <TableFooter>
                  <TableRow>
                    <TableCell>Le total est: {total}</TableCell>
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

    const columnscredit = [
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

    React.useEffect(() => {
        var arr = [];
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
                });
            });

            arr.push({
                'name': key,
                'ventes': quan,
                'somme': som,
            });
        }
        setSiarr(arr)
    }, [])

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <Bread title="Dashboard" />
            <div style={{ marginTop: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        <div className='caro' style={{ background: 'linear-gradient(-135deg, #899FD4 0%, #A389D4 100%)' }}>
                            <Typography>{props.cntpin} Produits Interne</Typography>
                        </div>
                    </Grid>
                    <Grid item md={3}>
                        <div className='caro' style={{ background: 'linear-gradient(-135deg, #1de9b6 0%, #1dc4e9 100%)' }}>
                            <Typography>{props.cntpex} Produits Externe</Typography>
                        </div>
                    </Grid>
                    <Grid item md={3}>
                        <div className='caro' style={{ background: 'linear-gradient(-135deg, #bdc3c7  0%, #2c3e50 100%)' }}>
                            <Typography>{props.clits} Clients</Typography>
                        </div>
                    </Grid>
                    <Grid item md={3}>
                        <div className='caro' style={{ background: 'linear-gradient(-135deg, #f27781  0%, #ed4264 100%)' }}>
                            <Typography>{props.vnts} Ventes</Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '10px' }}>
                    <Grid item md={12}>
                        <Typography style={{ marginBottom: '10px' }}>Caise</Typography>
                        <Paper style={{ padding: '10px' }}>
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
                            columns={columnscredit}
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
                            options={optionsc}
                        />
                    </Grid>
                </Grid>
            </div>
        </Authenticated>
    )
}