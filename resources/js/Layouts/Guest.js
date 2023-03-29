import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
//import BoxedLayout from "../../core/components/BoxedLayout";
import Box from '@mui/material/Box';
import logo from '../../../storage/app/public/logoad.png';
import imagePath from '../../../storage/app/public/bgadi.png';
import Container from '@mui/material/Container';

export default function Guest({ children }) {
    return (
        <Grid container component="main" sx={{ height: "100vh" }}>
            <Grid 
                item
                xs={false} 
                sm={4} 
                md={7}
                sx={{
                    backgroundImage: `url(${imagePath})`,
                    backgroundRepeat: "no-repeat",
                    bgcolor: "background.default",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >

            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} square>
                <Container component="main" maxWidth="xs" sx={{ mt: 20 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <img width={200} src={logo} alt="Logo" />
                    {children}
                </Box>
                </Container>
            </Grid>
        </Grid>
       
    );
}
