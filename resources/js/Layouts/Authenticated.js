import React, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/inertia-react';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

export default function Authenticated({ auth, header, children }) {

    const [anchorElUser, setAnchorElUser] = React.useState();
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    }
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    return (
        <div>

            <div className='topBar'>

                <div className='topBarLeft'>
                    <div style={{ marginRight: '10px', color: 'black' }}>
                        {auth.user.name}
                    </div>
                    <div>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem>
                                <Link href={route('logout')} method="post" as='button'>
                                    <Typography textAlign="center">Log out</Typography>
                                </Link>

                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>

            <div className='sideBar'>
                <div style={{ textAlign: 'center', zIndex: '100', height: '60px', borderBottom: '1px solid red' }}>
                    <Typography variant="h4" component="h2" className='logoTitle'>Sky</Typography>
                </div>
                <ul>
                    {/* {auth.user.role === 'admin' ? */}
                    <li>
                        <a href="/">Dashboard</a>
                    </li>
                    {auth.user.role === 'admin' ?
                        <>
                            <li>
                                <a href="/conteneurs">Conteneur</a>
                            </li>
                        </>
                        : ''}
                    <li>
                        <a href="/inproduct">Magasin</a>
                    </li>
                    <li>
                        <a href="/stock">Stock par vendeur</a>
                    </li>
                    {auth.user.role === 'admin' ?
                        <li>
                            <a href="/movements">Movements</a>
                        </li> : ''}
                    <li>
                        <a href="/client">Client</a>
                    </li>



                    {/* {auth.user.role === 'admin' ?
                        <>
                            <li>
                                <a href="/exproduct">Produit Externe</a>
                            </li>
                        </>
                        : ''} */}
                    <li>
                        <a href="/vendeur">Vendeur</a>
                    </li>
                    <li>
                        <a href="/charge">Charge</a>
                    </li>
                    <li>
                        <a href="/virment">Virement</a>
                    </li>
                    <li>
                        <a href="/vente">Vente</a>
                    </li>
                    {auth.user.role === 'admin' ?
                        <>
                            <li>
                                <a href="/facture">Factures</a>
                            </li>
                            <li>
                                <a href="/users">Utilisateurs</a>
                            </li>
                        </>
                        : ''}
                </ul>
            </div>


            {/* {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )} */}

            <main className='main'>{children}</main>
        </div>
    );
}
