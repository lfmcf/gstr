import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { useForm } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import Select from 'react-select'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Bread from '@/Components/Bread';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import moment from 'moment';

const theme = createTheme({
  palette: {
    neutral: {
      main: 'rgb(86,152,161)',
      contrastText: '#fff',
    },
  },
});

export default function edit(props) {

    const { vente } = props
    
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        id: vente.id,
        bon: vente.bon,
        date: new Date(vente.date),
        vendeur: vente.vendeur,
        client: vente.client,
        produit: vente.produit,
        payment: vente.payment,
        tc: vente.tc,
        avance: vente.avance,
        reste: vente.reste,
        paye: vente.paye,
        observation: vente.observation
    });

    let addProduitFields = () => {
        let newArr = { ...data };
        newArr.produit.push({ name: '', somme: '', prix: '', quantite: '' });
        setData(newArr);
    }

    let addtcFields = () => {
        let newArr = { ...data };
        newArr.tc.push({numero: '', date: new Date(), document: ''});
        setData(newArr);
    }

    let removeProduitFields = (i) => {
        let newArr = { ...data };
        newArr.produit.splice(i, 1);
        setData(newArr);
    }

    let removePtcFields = (i) => {
        let newArr = { ...data };
        newArr.tc.splice(i, 1);
        setData(newArr);
    }

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
    }

    const handleSelectChange = (selectedOption, name) => {
        name.action == 'clear' ?
        setData(name.name, "") : setData(name.name, selectedOption.value);
    }

    const handleProduitSelectChange = (selectedOption, name, i) => {
        
        let newFormValues = { ...data };
        name.action == 'clear' ? newFormValues.produit[i][name.name] = "" :
        newFormValues.produit[i][name.name] = selectedOption.value;
        setData(newFormValues);
    }

    const handleProduitChange = (i, e) => {
        let newFormValues = { ...data };
        newFormValues.produit[i][e.target.name] = e.target.value;
        e.target.name === 'prix' || e.target.name === 'quantite' ? 
        newFormValues.produit[i]['somme'] = newFormValues.produit[i]['prix'] * newFormValues.produit[i]['quantite'] : ''
        setData(newFormValues);
    }

    const handleTcChange = (i, e) => {
        
        let newFormValues = { ...data };
        if(e.target.files && e.target.files.length > 0) {
            newFormValues.tc[i][e.target.name] = e.target.files[0];
        }else {
            newFormValues.tc[i][e.target.name] =  e.target.value;
        }
        setData(newFormValues);
    }

    const handleTcDateChange = (i, date) => {
        
        let newFormValues = { ...data };
        newFormValues.tc[i]['date'] = date;
        setData(newFormValues);
    }

    const handleAvanceChange = (e) => {
        let newFormValues = { ...data };
        newFormValues.avance[0]['montant'] = e.target.value;
        setData(newFormValues);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(data)
        post(route('updateVente'));
    }

    let voptions = props.vendeur.map(function (sa) {
        return { value: sa.name + ' ' + sa.lastName, label: sa.name + ' ' + sa.lastName };
    })

    let coptions = props.client.map(function (sa) {
        return { value: sa.name + ' ' + sa.lastName, label: sa.name + ' ' + sa.lastName };
    })

    let poptions = props.pro.map(function (sa) {
        if(sa.volume) {
            return { value: sa.productName + ', ' + sa.volume + ', ' + sa.reference + ', ' + moment(sa.date).format('DD/MM/yyyy'), label: sa.productName + ', ' + sa.volume + ', ' + sa.reference + ', ' + moment(sa.date).format('DD/MM/yyyy') };
        }else{
            return { value: sa.productName, label: sa.productName};
        }
        
    })

    React.useEffect(() => {
        setData('reste', data.produit.reduce((a, o) => {return parseInt(a) + parseInt(o.somme)},0) - data.avance[0].montant)
    }, [data.avance[0].montant])

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Modifier vente" />
            <Bread title="Ventes" sectTitle="Modifier" />

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} style={{marginTop: '10px'}}>
                    <Grid item md={6}>
                        <TextField label="Bon n°" size="small" name='bon' fullWidth onChange={handleChange} value={data.bon} />
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
                        {/* <Input placeholder="Date" name='date' fullWidth inputProps={ariaLabel} onChange={handleChange} /> */}
                    </Grid>
                    <Grid item md={6}>
                        <Select options={voptions}
                            name='vendeur'
                            placeholder='Vendeur'
                            isClearable
                            onChange={handleSelectChange}
                            className="basic"
                            classNamePrefix="basic"
                            defaultValue={{label: data.vendeur, value: data.vendeur}}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Select options={coptions}
                            name='client'
                            placeholder='Client'
                            isClearable
                            onChange={handleSelectChange}
                            className="basic"
                            classNamePrefix="basic"
                            defaultValue={{label: data.client, value: data.client}}
                        />
                    </Grid>
                </Grid>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <IconButton color="primary" aria-label="ajouter produit" component="label" onClick={addProduitFields}>
                            <AddIcon />
                        </IconButton>
                        
                    </div>
                    {data.produit.map((element, index) => (
                        <fieldset key={index} style={{ padding: '20px 10px' }}>
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
                                            name='name'
                                            placeholder='Nom produit'
                                            isClearable
                                            onChange={(selectedOption, name) => handleProduitSelectChange(selectedOption, name, index)}
                                            className="basic"
                                            classNamePrefix="basic"
                                            defaultValue={{label: element.name, value: element.name}}
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField size="small" type="number" name='quantite' fullWidth label="Quantité" onChange={e => handleProduitChange(index, e)} value={element.quantite} />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField size="small" type="number" name='prix' fullWidth label="Prix" onChange={e => handleProduitChange(index, e)} value={element.prix} />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField size="small" name='somme' fullWidth label="Somme" value={element.somme} disabled />
                                    </Grid>
                                </Grid>
                            </div>
                        </fieldset>
                    ))}
                </div>
                <Grid container spacing={3} style={{marginTop:'10px',marginBottom:'20px'}}>
                    <Grid item md={6}>
                        <TextField size="small" name='total' fullWidth label="Total" value={data.produit.reduce((a, o) => {return parseInt(a) + parseInt(o.somme)},0)} disabled />
                    </Grid>
                    <Grid item md={6}>
                        <Select options={[
                            { label: 'Traite', value: 'Traite' },
                            { label: 'Chèque', value: 'Chèque' },
                            { label: 'Crédit', value: 'Crédit' },
                            { label: 'Espèce', value: 'Espèce' },
                        ]}
                            name='payment'
                            placeholder='Payment'
                            isClearable
                            onChange={handleSelectChange}
                            className="basic"
                            classNamePrefix="basic"
                            defaultValue={{label: data.payment, value: data.payment}}
                        />
                    </Grid>
                </Grid>
                {/* <Grid container spacing={3}>
                    
                </Grid> */}
                <div style={{display: data.payment == 'Traite' || data.payment == 'Chèque' ? 'block' : 'none',marginBottom:'20px'}}>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <IconButton color="primary" aria-label="ajouter produit" component="label" onClick={addtcFields}>
                            <AddIcon />
                        </IconButton>
                    </div>
                    {data.tc.map((element, index) => (
                        <fieldset key={index} style={{ padding: '20px 10px' }}>
                            <legend>{data.payment} {index + 1}</legend>
                            <div>
                                {index > 0 ?
                                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                                        <button type="button" style={{ width: '14px', height: '14px', background: 'transparent', padding: '0', margin: '0 0 20px 0' }} onClick={() => removePtcFields(index)}>
                                            <svg className="mdi-icon" style={{ verticalAlign: 'middle' }} width="14" height="14" fill="#000" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>
                                        </button>
                                    </div>

                                    : ''
                                }
                                <Grid container spacing={2}>
                                    <Grid item md={4}>
                                        <TextField name='numero' value={data.tc[index].numero} size="small" fullWidth label='Numero' onChange={e => handleTcChange(index, e)} />
                                    </Grid>
                                    <Grid item md={4}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Date Payement"
                                                value={data.tc[index].date}
                                                inputFormat="dd/MM/yyyy"
                                                name="date"
                                                onChange={(newValue) => handleTcDateChange(index, newValue)}
                                                renderInput={(params) => <TextField size="small" {...params} fullWidth />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item md={4}>
                                        <TextField type='file' name='document' size='small' fullWidth onChange={e => handleTcChange(index, e)} />
                                    </Grid>
                                </Grid>
                            </div>
                        </fieldset>
                    ))}
                </div>
                <Grid container spacing={3}>
                    <Grid item md={6}>
                        <TextField name='montant' value={data.avance[0].montant} size="small" fullWidth label='Avance' onChange={handleAvanceChange}/>
                    </Grid>
                    <Grid item md={6}>
                        <TextField name='reste' size="small" fullWidth label='Reste' value={data.reste} disabled />
                    </Grid>
                    <Grid item md={12}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={data.paye} name="paye" color="success" onChange={(e) => setData('paye', e.target.checked)} />} label="Payé" />
                        </FormGroup>
                    </Grid>
                    <Grid item md={12}>
                        <TextField name='observation' fullWidth label='Observation' onChange={handleChange} value={data.observation} />
                    </Grid>
                    
                </Grid>
                <ThemeProvider theme={theme}>
                    <Button style={{ marginTop: '20px' }} color="neutral" type='submit' variant="contained">Modifier</Button>
                </ThemeProvider>
                
            </form>

        </Authenticated>
    )
}