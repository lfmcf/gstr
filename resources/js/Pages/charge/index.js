import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import MUIDataTable from "mui-datatables";
import CustomToolbar from '@/Components/CustomToolbar';
import { Inertia } from '@inertiajs/inertia';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Bread from '@/Components/Bread';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { usePage } from '@inertiajs/inertia-react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import moment from 'moment';
import { TableContainer, Table, TableBody, TableCell, TableRow, TableHead, TablePagination, TableFooter } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function index(props) {

    // const { charge } = props;
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [ids, setIds] = React.useState();
    const { flash } = usePage().props;
    const [fromv, setFromv] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [tov, setTov] = useState(new Date());
    const [charge, setCharge] = useState(props.charge);
    const totalcharge = charge.reduce((prev, next) => prev + next.montant, 0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false)
    }

    const handleNavigate = () => {
        Inertia.get(route('createCharge'))
    }

    const update = (row) => {
        Inertia.get(route('editCharge', { id: row.id }))
    }

    const handleClickV = () => {
        axios.post(route('getcharge'), { "fromv": fromv, 'tov': tov }).then(res => {
            setCharge(res.data)
        })
    }

    React.useEffect(() => {
        flash.message ? setOpenAlert(true) : setOpenAlert(false)
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
            name: "",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    const id = tableMeta.rowData[0];
                    let row;
                    function search(id, data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].id === id) {
                                row = data[i]
                                // console.log(row)
                                update(row);
                            }
                        }
                    }
                    return (
                        <IconButton onClick={() => { search(id, charge) }}>
                            <EditIcon />
                        </IconButton>
                    );
                }
            }

        },
        {
            name: "operation",
            label: "Opération",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name: "date",
            label: "Date",
            options: {
                filter: true,
                filterType: 'multiselect',
                customBodyRender: (value, tableMeta, updateValue) => {
                    return moment(value).format('DD/MM/yyyy')
                }
            }
        },
        {
            name: "montant",
            label: "Montant",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name: "ref",
            label: "Réference",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
    ]

    const options = {
        //rowsPerPageOptions: [5,10,15, 50, 100],
        rowsPerPage: 10,
        responsive: 'vertical',
        enableNestedDataAccess: '.',
        downloadOptions: {
            separator: ";",
            filterOptions: {
                useDisplayedColumnsOnly: false,
                useDisplayedRowsOnly: false
            }
        },
        onRowsDelete: (rowsDeleted, dataRows) => {
            const idsToDelete = rowsDeleted.data.map(d => charge[d.dataIndex].id);
            const ids = { 'ids': idsToDelete };
            setIds(ids)
            handleClickOpen()
            // Inertia.post(route('deleteCharge', ids));
        },
        customToolbar: () => {
            return (
                <CustomToolbar handleClick={handleNavigate} />
            )
        },
        customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
            return (
                <TableFooter>
                    <TableRow>
                        <TableCell>Le total des charges est: {totalcharge}</TableCell>
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

    const handleDelete = () => {
        Inertia.post(route('deleteCharge', ids));
        setOpen(false)
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Charges" />
            <Bread title="Charges" />
            <Grid container spacing={2} style={{ marginTop: '10px', marginBottom: '10px' }}>
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
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button variant="outlined" onClick={handleClickV}>Chercher</Button>
                    </div>
                </Grid>
            </Grid>
            <div>

                <MUIDataTable
                    data={charge}
                    columns={columns}
                    options={options}
                />
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmer suppression"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Voulez vous vraiment suprimer les éléments selectionner ?
                        si oui cliquer sur Confirmer ou Anunuler pour anuuler la suppression
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Anunuler</Button>
                    <Button onClick={() => handleDelete()} autoFocus>
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseAlert} severity="success">
                    {flash.message}
                </Alert>
            </Snackbar>
        </Authenticated>
    )
}