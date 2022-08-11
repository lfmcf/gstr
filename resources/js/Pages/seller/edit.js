import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { useForm } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import Bread from '@/Components/Bread';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    neutral: {
      main: 'rgb(86,152,161)',
      contrastText: '#fff',
    },
  },
});

export default function edit(props) {

    const { vendeur } = props;

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        id: vendeur.id,
        name: vendeur.name,
        lastName: vendeur.lastName,
        sector: vendeur.sector,
        tel: vendeur.tel,
        created_by: vendeur.created_by,
    })

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('updateseller'));
    }
    
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Modifier vendeur" />
            <Bread title="Vendeurs" secTitle="Modifier"/>
            <div style={{marginTop:'20px'}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Nom" name='name' onChange={handleChange} value={data.name} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Prénom" name='lastName' onChange={handleChange} value={data.lastName} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Secteur" name='sector' onChange={handleChange} value={data.sector} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Tél" name='tel' onChange={handleChange} value={data.tel} />
                        </Grid>
                    </Grid>
                    <ThemeProvider theme={theme}>
                        <Button style={{marginTop:'20px'}} color="neutral" type='submit' variant="contained">Modifier</Button>
                    </ThemeProvider>
                </form>
            </div>
        </Authenticated>

    )
}