import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import MUIDataTable from "mui-datatables";
import { TableContainer, Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material'
import CustomToolbar from '@/Components/CustomToolbar';
import { Inertia } from '@inertiajs/inertia';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Bread from '@/Components/Bread';
import moment from 'moment';

export default function index(props) {


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
            name: "from",
            label: "de",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name: "to",
            label: "vers",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name: "date",
            label: "Date d'opération",
            options: {
                filter: true,
                filterType: 'multiselect',
                customBodyRender: (value, tableMeta, updateValue) => {
                    return moment(value).format('DD/MM/yyyy')
                }
            }
        },
    ]

    const options = {
        rowsPerPageOptions: [5, 10, 15, 50, 100],
        rowsPerPage: 10,
        responsive: 'vertical',
        enableNestedDataAccess: '.',
        selectableRows: false,
        downloadOptions: {
            separator: ";",
            filterOptions: {
                useDisplayedColumnsOnly: false,
                useDisplayedRowsOnly: false
            }
        },
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const dataValues = props.data.find(x => x.id === rowData[0])
            const parseddataValues = dataValues.product
            return (
                <tr>
                    <td colSpan={2}>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom produit</TableCell>
                                        {/* <TableCell>Quantité initial</TableCell> */}
                                        <TableCell>Quantité déplacée</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {parseddataValues.map((p, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {p.nom + ',' + p.volume + ',' + p.reference}
                                            </TableCell>
                                            {/* <TableCell component="th" scope="row">
                                                {p.quantite}
                                            </TableCell> */}
                                            <TableCell component="th" scope="row">
                                                {p.qaun}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </td>
                </tr>
            )
        },
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Movements" />
            <Bread title="Movements" />
            <div>

                <MUIDataTable
                    data={props.data}
                    columns={columns}
                    options={options}
                />

            </div>
        </Authenticated>
    )
}