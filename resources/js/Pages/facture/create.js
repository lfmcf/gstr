import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Grid from '@mui/material/Grid';
import { useForm } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import Bread from '@/Components/Bread';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
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
        nomClient: '',
        ice: '',
        produit: [{ name: '', unite:'', prix: '', quantite: '', montant: '' }],
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data)
        // post(route('storeFacture'));
    }

    const handleChange = (e) => {
        setData(e.target.name, e.target.value)
    }

    let addProduitFields = () => {
        let newArr = { ...data };
        newArr.produit.push({ name: '', unite:'', prix: '', quantite: '', montant: '' });
        setData(newArr);
    }

    const handleProduitChange = (i, e) => {
        let newFormValues = { ...data };
        newFormValues.produit[i][e.target.name] = e.target.value;
        e.target.name === 'prix' || e.target.name === 'quantite' ? 
        newFormValues.produit[i]['montant'] = newFormValues.produit[i]['prix'] * newFormValues.produit[i]['quantite'] : ''
        setData(newFormValues);
    }

    return(
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Créer facture" />
            <Bread title="Factures" secTitle="Créer" />
            <div style={{marginTop:'20px'}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="Nom Client" name='nomClient' onChange={handleChange} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField variant="outlined" fullWidth size='small' label="ICE" name='ice' onChange={handleChange} />
                        </Grid>
                    </Grid>
                    <div style={{ marginTop:'10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <IconButton color="primary" aria-label="ajouter produit" component="label" onClick={addProduitFields}>
                                <AddIcon />
                            </IconButton>
                        </div>
                        {data.produit.map((element, index) => (
                            <fieldset key={index} style={{ padding: '20px 10px',marginTop:'10px' }}>
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
                                            <TextField variant="outlined" fullWidth size='small' label="Produit" name='name' onChange={e => handleProduitChange(index, e)} />
                                        </Grid>
                                        <Grid item md={3}>
                                            <TextField variant="outlined" fullWidth size='small' label="Unite" name='unite' onChange={e => handleProduitChange(index, e)} />
                                        </Grid>
                                        <Grid item md={3}>
                                            <TextField variant="outlined" fullWidth size='small' label="Prix" name='prix' onChange={e => handleProduitChange(index, e)} />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextField variant="outlined" fullWidth size='small' label="Quantite" name='quantite' onChange={e => handleProduitChange(index, e)} />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextField variant="outlined" fullWidth size='small' label="Montant" value={element.montant} name='montant' disabled />
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