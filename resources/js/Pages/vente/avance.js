import Bread from "@/Components/Bread";
import Authenticated from "@/Layouts/Authenticated";
import { Head } from "@inertiajs/inertia-react";
import React from "react";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm } from '@inertiajs/inertia-react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    neutral: {
      main: 'rgb(86,152,161)',
      contrastText: '#fff',
    },
  },
});

export default function Avance(props) {

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        id: props.vente,
        montant : 0,
        date: new Date(),
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('addAvance'));
    }
    return(
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Ajouter avance" />
            <Bread title="Ajouter avance" />
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} style={{marginTop: '10px'}}>
                    <Grid item md={6}>
                        <TextField name="montant" variant="outlined" label="Montant" fullWidth onChange={(e) => setData('montant', e.target.value)} />
                    </Grid>
                    <Grid item md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date"
                                value={data.date}
                                inputFormat="dd/MM/yyyy"
                                onChange={(newValue) => {
                                    setData('date', newValue);
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <ThemeProvider theme={theme}>
                    <Button style={{ marginTop: '20px' }} color="neutral" type='submit' variant="contained">Ajouter</Button>
                </ThemeProvider>
            </form>
        </Authenticated>
    )
}