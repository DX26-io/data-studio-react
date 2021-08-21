import './header.scss';

import React from 'react';
import { Storage } from 'react-jhipster';
import DataStudioAvatar from 'app/shared/layout/header/partials/data-studio-avatar';
import Logo from 'app/shared/components/logo/logo';
import { Divider, Flex, View } from '@adobe/react-spectrum';
import CanvasHeader from './canvas-header';
import CanvasSearchHeader from './canvas-search-header';

import { Link } from 'react-router-dom';
export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isSwaggerEnabled: boolean;
  currentLocale: string;
  onLocaleChange: Function;
  isCanvas: boolean;
  isHome: boolean;
}

const Header = (props: IHeaderProps) => {
  // TODO fix the UI issues with the header icons
  // TODO use the below method in user preferences page
  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    props.onLocaleChange(langKey);
  };

  return (
    <>
      <View padding="size-150" backgroundColor="default">
        <header>
          <Flex justifyContent="space-between" alignSelf="center">
            <Flex justifyContent="center" alignItems="center">
              {/* TODO: will be replaced */}
              <Link to="/" style={{ color: 'black' }}>
                <Logo />
              </Link>
              {props.isCanvas && (
              
                  <CanvasSearchHeader />
                
              )}
            </Flex>
            <Flex justifyContent="end">
              {props.isCanvas && (
                <React.Fragment>
                  <CanvasHeader />
                </React.Fragment>
              )}
            </Flex>
          </Flex>
          <div style={{ position: 'absolute', right: '6px', top: '10px' }} className="profile">
            {' '}
            <DataStudioAvatar />
          </div>
        </header>
      </View>
    </>
  );
};

export default Header;
