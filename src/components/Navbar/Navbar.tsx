import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { activePage, LoginState, CustomState } from '../utils';

interface NavbarProps {
  loginState: CustomState<LoginState>,
  activePageState: CustomState<activePage>,
}


export default function Navbar(props: NavbarProps) {
  const { loginState, activePageState } = props;
  function handleClick(page: activePage) {
    activePageState.set(page);
  }
  return (
    <AppBar position="static" sx={{ backgroundColor: '#212227', boxShadow: 'none' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FlashHub
        </Typography>
        {(() => {
        switch (activePageState.get()) {
          case "signup":
            return <Button color="inherit" onClick={() => handleClick("login")}  >Login  </Button>;
          case "login":
            return <Button color="inherit" onClick={() => handleClick("signup")}>  SignUp  </Button>;
          default:
            return <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>;
        }
      })()}
        
        
        
      </Toolbar>
    </AppBar>
  );
}

