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

export default function create(props) {
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        productName: '',
        reference: '',
        volume: '',
        price: '',
        quantite: '',
        created_by: ''
    })

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('storeinproduct'));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Créer produit interne" />
            <Bread title="Produit Internes" secTitle="Créer" />
            <div style={{marginTop:'20px'}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Nom produit" name='productName' onChange={handleChange} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Référence" name='reference' onChange={handleChange} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Volume" name='volume' onChange={handleChange} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Prix" name='price' onChange={handleChange} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Quantité" name='quantite' onChange={handleChange} />
                        </Grid>
                    </Grid>
                    <ThemeProvider theme={theme}>
                        <Button style={{marginTop:'20px'}} color="neutral"  type='submit' variant="contained">Ajouter</Button>
                    </ThemeProvider>
                </form>
            </div>
        </Authenticated>
    )
}