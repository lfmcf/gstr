import React from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';


export default function Bread(props) {
    return (
        <div role="presentation" style={{ margin: '10px 0' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/"
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                </Link>
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/material-ui/getting-started/installation/"
                >
                    <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    {props.title}
                </Link>
                {props.secTitle ? 
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="/material-ui/getting-started/installation/"
                >
                    {/* <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
                    {props.secTitle}
                </Link>
                : ''}
            </Breadcrumbs>
        </div>
    )
}