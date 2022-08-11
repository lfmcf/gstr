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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const theme = createTheme({
  palette: {
    neutral: {
      main: 'rgb(86,152,161)',
      contrastText: '#fff',
    },
  },
});

const ariaLabel = { 'aria-label': 'description' };

export default function edit(props) {

    const { client } = props;

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        id: client.id,
        name: client.name,
        lastName: client.lastName,
        tel: client.tel,
        adresse: client.adresse,
        activite: client.activite,
        localisation: client.localisation,
        isCompany: client.isCompany ? client.isCompany: false,
        ece: client.ece,
        created_by: client.created_by
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
    }

    const handleCheckChange = (e) => {
        
        setData("isCompany", e.target.checked)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('updateClient'));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Modifier client" />
            <Bread title="Clients" secTitle="Modifier" />
            <div style={{marginTop:'20px'}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Nom" name='name' inputProps={ariaLabel} onChange={handleChange} value={data.name} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Prénom" name='lastName' inputProps={ariaLabel} onChange={handleChange} value={data.lastName} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Tél" name='tel' inputProps={ariaLabel} onChange={handleChange} value={data.tel} />
                        </Grid>

                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Adresse" name='adresse' inputProps={ariaLabel} onChange={handleChange} value={data.adresse} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Activité" name='activite' inputProps={ariaLabel} onChange={handleChange} value={data.activite} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Localisation" name='localisation' inputProps={ariaLabel} onChange={handleChange} value={data.localisation} />
                        </Grid>
                        <Grid item md={6}>
                            <FormControlLabel control={<Checkbox checked={data.isCompany} name='isCompany' onChange={handleCheckChange} inputProps={{ 'aria-label': 'controlled' }} />} label="Entreprise ?" />
                        </Grid>
                        <Grid item md={6} style={{display: data.isCompany ? 'block': 'none'}}>
                            <TextField variant="outlined" fullWidth size='small' label="ECE" name='ece' onChange={handleChange} />
                        </Grid>
                    </Grid>
                    <ThemeProvider theme={theme}>
                        <Button style={{marginTop:'20px'}} color="neutral" type='submit' variant="contained">Modifer</Button>
                    </ThemeProvider>
                </form>
            </div>
        </Authenticated>
    )
}