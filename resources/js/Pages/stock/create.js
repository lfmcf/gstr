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
import moment from 'moment';
import Select from 'react-select';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

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
        vendeur: '',
        date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        product: [{ name: '', quantite: '' }],
        created_by: props.auth.user.id
    })

    let voptions = props.vendeur.map(function (sa) {

        return { value: sa.name + ' ' + sa.lastName, label: sa.name + ' ' + sa.lastName };

    })

    let poptions = props.pro.map(function (sa) {
        return { value: sa.productName + ', ' + sa.volume, label: sa.productName + ', ' + sa.volume };
    })

    const selectStyles = (hasErrors) => ({
        control: (styles) => ({
            ...styles,
            ...(hasErrors && { borderColor: 'red' }),
        }),
    });

    const handleSelectChange = (selectedOption, name) => {
        name.action == 'clear' ?
            setData(name.name, "") : setData(name.name, selectedOption.value);
        clearErrors(name.name)
    }

    const handleProduitSelectChange = (selectedOption, nom, i) => {
        let newFormValues = { ...data };
        nom.action == 'clear' ? newFormValues.product[i][nom.name] = "" :
            newFormValues.product[i][nom.name] = selectedOption.value;
        clearErrors('product.' + i + '.' + nom.name)
        setData(newFormValues);
    }

    const handleQauntiteChange = (i, e) => {
        let newFormValues = { ...data };
        newFormValues.product[i][e.target.name] = e.target.value;
        setData(newFormValues)
    }

    let addProduitFields = () => {
        let newArr = { ...data };
        newArr.product.push({ name: '', quantite: '' });
        setData(newArr);
    }

    let removeProduitFields = (i) => {
        let newArr = { ...data };
        newArr.product.splice(i, 1);
        setData(newArr);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post('attahctoseller');
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Créer" />
            <Bread title="Vendeurs" secTitle="Créer" />

            <div style={{ marginTop: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <Select options={voptions}
                                name='vendeur'
                                placeholder='Vendeur'
                                isClearable
                                onChange={handleSelectChange}
                                styles={selectStyles(errors.vendeur)}
                                className="basic"
                                classNamePrefix="basic"
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
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <IconButton color="primary" aria-label="ajouter produit" component="label" onClick={addProduitFields}>
                                <AddIcon />
                            </IconButton>

                        </div>
                        {data.product.map((element, index) => (
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
                                            <Select options={poptions}
                                                name="name"
                                                onChange={(selectedOption, nom) => handleProduitSelectChange(selectedOption, nom, index)}
                                                className="basic"
                                                classNamePrefix="basic"
                                                placeholder='Nom produit'
                                                isClearable
                                                styles={selectStyles(errors['produit.' + index + '.name'])}
                                                value={poptions.find(option => option.value === element.name)}
                                            />
                                        </Grid>


                                        <Grid item md={6}>
                                            <TextField size="small" name='quantite' fullWidth label="Quantité" onChange={e => handleQauntiteChange(index, e)} />
                                        </Grid>
                                    </Grid>
                                </div>
                            </fieldset>

                        ))}
                    </div>

                    <ThemeProvider theme={theme}>
                        <Button style={{ marginTop: '20px' }} color="neutral" type='submit' variant="contained">Ajouter</Button>
                    </ThemeProvider>
                </form>
            </div>
        </Authenticated>
    )
}