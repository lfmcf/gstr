import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import MUIDataTable from "mui-datatables";
import CustomToolbar from '@/Components/CustomToolbar';
import { Inertia } from '@inertiajs/inertia';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Bread from '@/Components/Bread';

export default function index(props) {

    const { client } = props;

    const handleNavigate = () => {
        Inertia.get(route('createClient'))
    }

    const update = (row) => {
        Inertia.get(route('editClient', { id: row.id}))
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
                        <IconButton onClick={() => { search(id, client) }}>
                            <EditIcon />
                        </IconButton>
                    );
                }
            }

        },
        {
            name:"name",
            label: "Nom",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"lastName",
            label: "Prénom",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"tel",
            label: "Tél",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"activite",
            label: "Activité",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"adresse",
            label: "Adresse",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        // {
        //     name:"name",
        //     label: "Nom",
        //     options: {
        //         filter: true,
        //         filterType: 'multiselect',
        //     }
        // },
        
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
        onRowsDelete: (rowsDeleted, dataRows) => {
            const idsToDelete = rowsDeleted.data.map(d => client[d.dataIndex].id);
            const ids = {'ids': idsToDelete};
            Inertia.post(route('deleteClient', ids));
        },
        customToolbar: () => {
            return(
                <CustomToolbar handleClick={handleNavigate} />
            )
        }
    }


    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Clients" />
            <Bread title="Clients" />
            <div>
                <MUIDataTable
                    data={client}
                    columns={columns}
                    options={options}
                />
            </div>
        </Authenticated>
    )
}