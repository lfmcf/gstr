import React from 'react';
import Bread from '@/Components/Bread';
import { Head } from '@inertiajs/inertia-react';
import MUIDataTable from "mui-datatables";
import Authenticated from '@/Layouts/Authenticated';
import CustomToolbar from '@/Components/CustomToolbar';
import { Inertia } from '@inertiajs/inertia';
import Button from '@mui/material/Button';

export default function index(props) {

    const shearch = (id) => {
        Inertia.get(route('Showconteneurs', { 'id': id }))
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
            name: "nom",
            label: "Nom",
            options: {
                filter: true,
                filterType: 'multiselect',
                customBodyRender: (value, tableMeta, updateValue) => {

                    return (
                        <Button onClick={() => shearch(tableMeta.rowData[0])}>{value}</Button>
                    );
                }
            }
        },
        {
            name: "date",
            label: "Date",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
    ]

    const options = {
        rowsPerPageOptions: [5, 10, 15, 50, 100],
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
        onRowsDelete: (rowsDeleted, dataRows) => {
            const idsToDelete = rowsDeleted.data.map(d => client[d.dataIndex].id);
            const ids = { 'ids': idsToDelete };
            setIds(ids)
            handleClickOpen()
            // Inertia.post(route('deleteClient', ids));
        },
        customToolbar: () => {
            return (
                <CustomToolbar handleClick={handleNavigate} />
            )
        }
    }

    const handleNavigate = () => {
        Inertia.get(route('createConteneur'))
    }


    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Conteneurs</h2>}
        >
            <Head title="Conteneurs" />
            <Bread title="Conteneurs" />

            <MUIDataTable
                data={props.data}
                columns={columns}
                options={options}
            />

        </Authenticated>
    )
}

