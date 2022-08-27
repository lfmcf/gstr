import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Grid from '@mui/material/Grid';
import { useForm } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import Bread from '@/Components/Bread';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
        operation: '',
        date: new Date(),
        montant: '',
        created_by: ''
    })

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('storecharge'));
    }

    return(
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Créer charge" />
            <Bread title="Charges" secTitle="Créer" />
            <div style={{marginTop:'20px'}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Opération" name='operation' onChange={handleChange} />
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
                                    renderInput={(params) => <TextField size="small" {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                            {/* <TextField variant="outlined" fullWidth size='small' label="Date" name='date' onChange={handleChange} /> */}
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Montant" name='montant' onChange={handleChange} />
                        </Grid>
                    </Grid>
                    <ThemeProvider theme={theme}>
                        <Button style={{ marginTop: '20px' }} color="neutral" type='submit' variant="contained">Ajouter</Button>
                    </ThemeProvider>
                </form>
                
            </div>
        </Authenticated>
    )

}