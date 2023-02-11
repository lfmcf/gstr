import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Bread from '@/Components/Bread';
import MUIDataTable from "mui-datatables";
import CustomToolbar from '@/Components/CustomToolbar';
import { Inertia } from '@inertiajs/inertia';

export default function index(props) {

    const { factures } = props;
    const [ids, setIds] = React.useState();

    const handleNavigate = () => {
        Inertia.get(route('createFacture'))
    }

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
            setIds(ids)
            //handleClickOpen()
            // Inertia.post(route('deleteClient', ids));
        },
        customToolbar: () => {
            return(
                <CustomToolbar handleClick={handleNavigate} />
            )
        }
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
            name: 'client',
            label: 'Client'
        },
        {
            name: 'numero',
            label: 'N°',
        },
        {
            name: 'date',
            label: 'Date'
        },
        {
            name: 'produit',
            label: 'Produit'
        },
        {
            name: 'unite',
            label: 'Unite'
        },
        {
            name: 'qauntite',
            label: 'Qauntite'
        },
        {
            name: 'prix',
            label: 'Prix'
        },
        {
            name: 'montant',
            label: 'Montant'
        },
    ]
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Factures</h2>}
        >
            <Head title="Factures" />
            <Bread title="Factures" />
            <div>
                <MUIDataTable
                    data={factures}
                    columns={columns}
                    options={options}
                />
            </div>
        </Authenticated>
    )
}