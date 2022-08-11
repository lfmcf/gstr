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

    const { users } = props;

    const handleNavigate = () => {
        Inertia.get(route('createUser'))
    }

    const update = (row) => {
        Inertia.get(route('editUser', { id: row.id}))
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
                        <IconButton onClick={() => { search(id, users) }}>
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
            name:"email",
            label: "Email",
            options: {
                filter: true,
                filterType: 'multiselect',
            }
        },
        {
            name:"role",
            label: "Role",
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
            <Head title="Utilisateurs" />
            <Bread title="Utilisateurs" />
            <div>
                
                <MUIDataTable
                    data={users}
                    columns={columns}
                    options={options}
                />
            </div>
        </Authenticated>
    )
}