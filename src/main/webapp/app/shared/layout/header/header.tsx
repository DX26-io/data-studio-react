import './header.scss';

import React, { useState } from 'react';
import { Translate, Storage } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';

import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Text } from '@adobe/react-spectrum'
import { Provider, defaultTheme, Button, ButtonGroup, LogicButton } from '@adobe/react-spectrum';
import {Menu, MenuTrigger,ActionButton,Item } from '@adobe/react-spectrum'

import Login from '@spectrum-icons/workflow/Login';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isSwaggerEnabled: boolean;
  currentLocale: string;
  onLocaleChange: Function;
}

const Headers = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    props.onLocaleChange(langKey);
  };

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };


  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header">
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />

      <div className="grow">
        <AppBar position="static">
          <Toolbar>

            <Text>dx26</Text>
            <div className="grow" />
            <div >

              <Provider theme={defaultTheme}>
                <MenuTrigger>
                  <ActionButton isQuiet>Account</ActionButton>
                  <Menu onAction={(key) => alert(key)}>
                    <Item key="Login">Login</Item>
                    <Item key="Register">Register</Item>
                  </Menu>
                </MenuTrigger>
              </Provider>

            </div>
          </Toolbar>
        </AppBar>
    
      </div>

    </div>
  );
};

export default Headers;
