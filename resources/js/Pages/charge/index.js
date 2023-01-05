import React from 'react';
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

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function index(props) {

    const { charge } = props;
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [ids, setIds] = React.useState();
    const { flash } = usePage().props

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
        Inertia.get(route('editCharge', { id: row.id}))
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
                        for(var i = 0; i < data.length; i++){
                            if(data[i].id === id){
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
            name:"operation",
            label: "Opération",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"date",
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
            name:"montant",
            label: "Montant",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"ref",
            label: "Réference",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
    ]

    const options = {
        rowsPerPageOptions: [5,10,15, 50, 100],
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
            const ids = {'ids': idsToDelete};
            setIds(ids)
            handleClickOpen()
            // Inertia.post(route('deleteCharge', ids));
        },
        customToolbar: () => {
            return(
                <CustomToolbar handleClick={handleNavigate} />
            )
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