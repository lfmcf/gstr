import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Grid from '@mui/material/Grid';
import { useForm } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import Select from 'react-select';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Bread from '@/Components/Bread';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const theme = createTheme({
  palette: {
    neutral: {
      main: 'rgb(86,152,161)',
      contrastText: '#fff',
    },
  },
});

export default function create(props) {

    const { user } = props;

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: ''
    })

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
        clearErrors(e.target.name)
    }

    const handleSelectChange = (selectedOption, name) => {
        name.action == 'clear' ?
        setData(name.name, "") : setData(name.name, selectedOption.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('storeUser'));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Modifier utilisateur" />
            <Bread title="Utilisateurs" secTitle="Modifier" />

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} style={{marginTop: '10px'}}>
                    <Grid item md={7}>
                        <TextField label="Nom Complet" size="small" name='name' fullWidth onChange={handleChange} value={data.name} error={errors.name ? true : false} />
                        <Typography variant="subtitle2" color="red">{errors.name}</Typography>
                    </Grid>
                    <Grid item md={7}>
                        <TextField label="Email" autoComplete="username" size="small" name='email' value={data.email} fullWidth onChange={handleChange} error={errors.email ? true : false} />
                        <Typography variant="subtitle2" color="red">{errors.email}</Typography>
                    </Grid>
                    <Grid item md={7}>
                        {/* <TextField label="Role" size="small" name='email' fullWidth onChange={handleChange} /> */}
                        <Select options={[
                            { label: 'Admin', value: 'Admin' },
                            {label: 'User', value: 'User'}
                        ]}
                        name='role'
                        placeholder='Role'
                        onChange={handleSelectChange}
                        isClearable
                        className="basic"
                        classNamePrefix="basic"
                        defaultValue={[{label: data.role, value:data.role}]}
                        />
                    </Grid>
                    <Grid item md={7}>
                        <TextField autoComplete="current-password" label="Password" type="password" size="small" name='password' fullWidth onChange={handleChange} error={errors.password ? true : false} />
                        <Typography variant="subtitle2" color="red">{errors.password}</Typography>
                    </Grid>
                </Grid>
                <ThemeProvider theme={theme}>
                    <Button style={{ marginTop: '20px' }} color="neutral" type='submit' variant="contained">Modifier</Button>
                </ThemeProvider>
            </form>
        </Authenticated>
    )
}