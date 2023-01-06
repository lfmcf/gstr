import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
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

    const { charge } = props;

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        id: charge.id,
        operation: charge.operation,
        date: charge.date,
        montant: charge.montant,
        ref: charge.ref,
        created_by: charge.created_by
    })

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('updateCharge'));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Modifier charge" />

            <Bread title="Charges" secTitle="Modifier" />
            <div style={{marginTop:'20px'}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Opération" name='operation' onChange={handleChange} value={data.operation} />
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
                            {/* <TextField variant="outlined" fullWidth size='small' label="Date" name='date' onChange={handleChange} value={data.date} /> */}
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Montant" name='montant' onChange={handleChange} value={data.montant} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Réference" name='ref' onChange={handleChange} value={data.ref} />
                        </Grid>
                    </Grid>
                    <ThemeProvider theme={theme}>
                        <Button style={{ marginTop: '20px' }} color="neutral" type='submit' variant="contained">Modifier</Button>
                    </ThemeProvider>
                </form>
                
            </div>
        </Authenticated>
    )

}