import React, { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { useForm } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import Bread from '@/Components/Bread';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import Select from 'react-select';
import axios from 'axios';

const theme = createTheme({
    palette: {
        neutral: {
            main: 'rgb(86,152,161)',
            contrastText: '#fff',
        },
    },
});

export default function create(props) {

    let coptions = props.con.map(function (sa) {
        return { value: sa.nom, label: sa.nom };
    })

    // const [products, setProducts] = useState()

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        conteneur: '',
        date: '',
        produit: [],
        created_by: props.auth.user.id,
        date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    })

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
        clearErrors(e.target.name)
    }

    const handleSelectChange = (selectedOption, name) => {
        // setData('conteneur', selectedOption.value)
        axios.post('/prductsfromcon', { 'con': selectedOption.value }).then(res => {
            const newData = {
                conteneur: selectedOption.value,
                produit: res.data[0].product,
            }
            setData({ ...data, ...newData })
        })
    }

    const handleQuantiteChange = (e, i) => {
        let newarr = { ...data }
        newarr.produit[i].qaun = e.target.value
        setData(newarr)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('storeinproduct'));
    }

    // React.useEffect(() => {
    //     setData('quantiteI', data.quantite)
    // }, [data.quantite])

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Créer produit interne" />
            <Bread title="Produit dans le magasin" secTitle="Ajouter" />
            <div style={{ marginTop: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <Select
                                isClearable
                                options={coptions}
                                className="basic"
                                classNamePrefix="basic"
                                onChange={handleSelectChange}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date"
                                    value={data.date}
                                    inputFormat="dd/MM/yyyy"
                                    onChange={(newValue) => {
                                        setData('date', moment(newValue).format('YYYY-MM-DD HH:mm:ss'));
                                    }}
                                    renderInput={(params) => <TextField size="small" {...params} fullWidth />}

                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>

                    {data.produit.length > 0 ?
                        data.produit.map((pr, i) => {
                            return (
                                <Grid container spacing={3} key={i} style={{ marginTop: '10px' }}>
                                    <Grid item md={3} >
                                        <TextField variant='outlined' size='small' label="produit" value={pr.nom + ', ' + pr.volume + ', ' + pr.reference} fullWidth disabled />
                                    </Grid>
                                    <Grid item md={3} >
                                        <TextField variant='outlined' size='small' label="Actuel quantité" value={pr.quantite} fullWidth disabled />
                                    </Grid>
                                    <Grid item md={6} >
                                        <TextField variant='outlined' size='small' label='Quantité' defaultValue={0} fullWidth disabled={pr.quantite == 0 ? true : false} onChange={(e) => handleQuantiteChange(e, i)} />
                                    </Grid>
                                    <Grid item md={6} style={{ display: 'none' }}>
                                        <TextField variant='outlined' size='small' label='Prix' defaultValue={pr.prix} fullWidth />
                                    </Grid>
                                </Grid>
                            )
                        })
                        : ''
                    }


                    <ThemeProvider theme={theme}>
                        <Button style={{ marginTop: '20px' }} color="neutral" type='submit' variant="contained">Ajouter</Button>
                    </ThemeProvider>
                </form>
            </div>
        </Authenticated >
    )
}