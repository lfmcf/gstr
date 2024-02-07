import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Bread from '@/Components/Bread';
import { useForm } from '@inertiajs/inertia-react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
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
        nom: '',
        date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        produit: [{ nom: '', quantite: '', reference: '', volume: '', prix: '' }],
        created_by: props.auth.user.id,
        description: ''
    })

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
    }

    const handleProduitChange = (i, e) => {
        let newFormValues = { ...data };
        newFormValues.produit[i][e.target.name] = e.target.value;
        clearErrors('produit.' + i + '.' + e.target.name)
        setData(newFormValues);
    }

    const addProduitFields = () => {
        let newArr = { ...data };
        newArr.produit.push({ nom: '', quantite: '', prix: '' });
        setData(newArr);
    }

    const removeProduitFields = (i) => {
        let newArr = { ...data };
        newArr.produit.splice(i, 1);
        setData(newArr);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('storeConteneur'))
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <div style={{ marginTop: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Nom" name='nom' onChange={handleChange} error={errors.nom ? true : false} />
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
                    <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <IconButton color="primary" aria-label="ajouter produit" component="label" onClick={addProduitFields}>
                                <AddIcon />
                            </IconButton>

                        </div>
                        {data.produit.map((element, index) => (
                            <fieldset key={index} style={{ padding: '20px 10px', marginTop: '10px' }}>
                                <legend>Produit {index + 1}</legend>
                                <div>
                                    {index > 0 ?
                                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                                            <button type="button" style={{ width: '14px', height: '14px', background: 'transparent', padding: '0', margin: '0 0 20px 0' }} onClick={() => removeProduitFields(index)}>
                                                <svg className="mdi-icon" style={{ verticalAlign: 'middle' }} width="14" height="14" fill="#000" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>
                                            </button>
                                        </div>

                                        : ''
                                    }
                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <TextField variant='outlined' label="Nom produit" name='nom' size='small' fullWidth onChange={(e) => handleProduitChange(index, e)} />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextField variant='outlined' label="Volume" name='volume' size='small' fullWidth onChange={(e) => handleProduitChange(index, e)} />
                                        </Grid>
                                        <Grid item md={4}>
                                            <TextField variant='outlined' label="Quantité" name='quantite' size='small' fullWidth onChange={(e) => handleProduitChange(index, e)} />
                                        </Grid>
                                        <Grid item md={4}>
                                            <TextField variant='outlined' label="Réference" name='reference' size='small' fullWidth onChange={(e) => handleProduitChange(index, e)} />
                                        </Grid>
                                        <Grid item md={4}>
                                            <TextField variant='outlined' label="Prix" name='prix' size='small' fullWidth onChange={(e) => handleProduitChange(index, e)} />
                                        </Grid>
                                    </Grid>
                                </div>
                            </fieldset>
                        ))}
                    </div>
                    <Grid container spacing={3}>
                        <Grid item md={12}>
                            <TextareaAutosize minRows={3} style={{ width: '98%', padding: '8px 12px', borderRadius: '8px' }} name='description' onChange={handleChange} placeholder="Description" />
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