import React, { useEffect } from 'react';
//import Button from '@/Components/Button';
import Button from '@mui/material/Button';
import Checkbox from '@/Components/Checkbox';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login({ status, canResetPassword }) {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const onHandleChange = (event) => {
        console.log(event.target.value)
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <Guest>
            <Head title="Log in" />
            <ValidationErrors errors={errors} />
            {/* <form onSubmit={submit}> */}
            <Box component="form" marginTop={3} noValidate onSubmit={submit}>
                {/* <TextField
                    margin='normal'
                    variant='filled'
                    label="Email"
                    type="text"
                    name="email"
                    autoComplete="username"
                    fullWidth
                    onChange={onHandleChange}
                /> */}
                 <FormControl sx={{ width:'100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                    <OutlinedInput 
                        id='email'
                        label="Email"
                        name='email'
                        onChange={onHandleChange}
                    />
                 </FormControl>
                <FormControl sx={{ mt: 2, width:'100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        name='password'
                        onChange={onHandleChange}
                    />
                </FormControl>
                {/* <TextField
                    margin="normal"
                    variant="filled"
                    label="Password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    fullWidth
                    onChange={onHandleChange}
                /> */}
                <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                    Log in
                </LoadingButton>
                {/* <div>
                    <Button variant="contained" type='submit' processing={processing} style={{ textAlign: 'center' }}>
                        Log in
                    </Button>
                </div> */}
            </Box>
            {/* </form> */}
        </Guest>
    );
}
