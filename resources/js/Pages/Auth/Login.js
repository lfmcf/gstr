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

export default function Login({ status, canResetPassword }) {
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
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <Guest>
            <Head title="Log in" />

            {/* {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>} */}

            <ValidationErrors errors={errors} />

            <form onSubmit={submit}>
                <div>
                    {/* <Label forInput="email" value="Email" /> */}
                    <TextField
                        label="Email"
                        type="text"
                        name="email"
                        autoComplete="username"
                        fullWidth
                        onChange={onHandleChange}
                    />
                    {/* <Input
                        type="text"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        handleChange={onHandleChange}
                        style={{width:'100%'}}
                    /> */}
                </div>

                <div style={{margin:'20px 0'}}>
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        fullWidth
                        onChange={onHandleChange}
                    />
                    {/* <Label forInput="password" value="Password" />
                    <Input
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        handleChange={onHandleChange}
                    /> */}
                </div>

                {/* <div >
                    <label >
                        <Checkbox name="remember" value={data.remember} handleChange={onHandleChange} />

                        <span>Remember me</span>
                    </label>
                </div> */}

                <div >
                    {/* {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900"
                        >
                            Forgot your password?
                        </Link>
                    )} */}

                    <Button variant="contained" type='submit' processing={processing} style={{textAlign:'center'}}>
                        Log in
                    </Button>
                </div>
            </form>
        </Guest>
    );
}
