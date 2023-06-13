import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import MUIDataTable from "mui-datatables";
import CustomToolbar from '@/Components/CustomToolbar';
import { Inertia } from '@inertiajs/inertia';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import {TableContainer, Table, TableBody, TableCell, TableRow, TableHead} from '@mui/material'
import Bread from '@/Components/Bread';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxIcon from '@mui/icons-material/AddBox';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { usePage } from '@inertiajs/inertia-react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function index(props) {

    const { vente } = props;
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
        Inertia.get(route('createVente'))
    }

    const update = (e, row) => {
        e == "update" ?
        Inertia.get(route('editVente', { id: row.id})) : 
        e == "show" ? Inertia.get(route('showVente', { id: row.id})) : 
        Inertia.get(route('avance', { id: row.id}))
    }

    React.useEffect(() => {
        flash.message ? setOpenAlert(true) : setOpenAlert(false)
    }, []);

    const handleDelete = () => {
        Inertia.post(route('deleteVente', ids));
        setOpen(false)
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
            name: "",
            label: "Actions",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    const id = tableMeta.rowData[0];
                    let row;
                    function search(e, id, data) {
                        for(var i = 0; i < data.length; i++){
                            if(data[i].id === id){
                                row = data[i]
                                update(e, row);
                            }
                        }
                    }
                    return (
                        <>
                            <IconButton onClick={() => { search("update", id, vente) }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => { search("show", id, vente) }}>
                                <SearchIcon />
                            </IconButton>
                            <IconButton onClick={() => { search("avance", id, vente) }}>
                                <AddBoxIcon />
                            </IconButton>
                        </>
                        
                    );
                }
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
            name: 'produit',
            label: 'Produit(s)',
            options: {
                filter: false,
                filterType: 'multiselect',
                customBodyRender: (value, tableMeta, updateValue) => {
                    const listItems = value.map( pro =>  <li key={pro.name}>{pro.name}</li>)
                    return(
                        <ul>{listItems}</ul>
                    )
                }
            }
        },
        {
            name:"vendeur",
            label: "Vendeur",
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
            label: "Payment",
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
            name:"paye",
            label: "Payé",
            options: {
                filter: true,
                filterType: '',
                customBodyRender: (value) => {
                    return (value ?  <CheckIcon color='success' /> : <CloseIcon color='error' />)
                }
            }
        }
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
            const idsToDelete = rowsDeleted.data.map(d => vente[d.dataIndex].id);
            const ids = {'ids': idsToDelete};
            setIds(ids)
            handleClickOpen()
        },
        customToolbar: () => {
            return(
                <CustomToolbar handleClick={handleNavigate} />
            )
        },
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const dataValues = vente.find(x => x.id === rowData[0])
            
            return (
                <>
                    <tr>
                        <td colSpan={7}>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nom produit</TableCell>
                                            <TableCell>Quantité</TableCell>
                                            <TableCell>Prix</TableCell>
                                            <TableCell>Somme</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataValues.produit.map((p, index) => (
                                            <TableRow key={index}>

                                                <TableCell component="th" scope="row">
                                                    {p.name}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {p.quantite}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {p.prix}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {p.somme}
                                                </TableCell>

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

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Ventes" />
            <Bread title="Ventes" />
            <div >
                <MUIDataTable
                    data={vente}
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