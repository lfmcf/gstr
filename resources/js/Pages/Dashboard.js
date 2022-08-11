import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Bread from '@/Components/Bread';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Dashboard(props) {
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
            </div>
        </Authenticated>
    );
}
