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

    const { expro } = props;

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        id: expro.id,
        productName: expro.productName,
        reference: expro.reference,
        marque: expro.marque,
        usage: expro.usage,
        price: expro.price,
        quantite: expro.quantite,
        created_by: expro.created_by
    })

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('updateexproduct'));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Modifier produit externe" />
            <Bread title="Produits Externes" secTitle="Modifier" />
            <div>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Nom produit" name='productName' onChange={handleChange} value={data.productName} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Référence" name='reference' onChange={handleChange} value={data.reference} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Marque" name='marque' onChange={handleChange} value={data.marque} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Usage" name='usage' onChange={handleChange} value={data.usage} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Prix" name='price' onChange={handleChange} value={data.price} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Quantité" name='quantite' onChange={handleChange} value={data.quantite} />
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