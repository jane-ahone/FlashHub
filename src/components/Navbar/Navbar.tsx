import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { activePage, LoginState, CustomState } from '../utils';

interface NavbarProps {
    loginState: CustomState<LoginState>,
    activePageState: CustomState<activePage>,
}

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Navbar(props: NavbarProps): JSX.Element {
    const { loginState, activePageState } = props;
    function handleClick(page: activePage) {
        activePageState.set(page);
    }


    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <AppBar position="static" sx={{ backgroundColor: '#212227', boxShadow: 'none' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    FlashHub
                </Typography>
                {(() => {
                    switch (activePageState.get()) {
                        case "login":
                            return <Button color="inherit" onClick={() => handleClick("home")}>  Home  </Button>;
                        default:
                            const items = [
                                (<Button color="inherit" sx={{ '&': { padding: '0px 20px' } }} onClick={() => handleClick("login")}  >  Login  </Button>),
                                (<Button color="inherit" sx={{ '&': { padding: '0px 20px' } }} onClick={() => handleClick("about")}>  About Us  </Button>),
                                (<Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar src={loginState.get().profilePicUrl} alt={loginState.get().name} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{
                                            mt: '45px',
                                            '& .MuiPaper-root': {
                                                backgroundColor: '#212227',
                                                color: 'white',
                                            },
                                        }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.map((setting) => (
                                            <MenuItem key={setting} onClick={handleCloseUserMenu} sx={{
                                                '&:hover': {
                                                    backgroundColor: '#3f3f3f',
                                                },
                                                '&': {
                                                    padding: '15px 40px',
                                                },
                                            }}>
                                                <Typography textAlign="center">{setting}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>),
                            ]
                            return items;
                    }
                })()}
            </Toolbar>
        </AppBar>
    );
}

