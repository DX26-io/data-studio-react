import './header.scss';

import React from 'react';
import { Storage, Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';
import Notifications from 'app/shared/layout/header/partials/notifications';
import DataStudioAvatar from 'app/shared/layout/header/partials/data-studio-avatar';
import Logo from 'app/shared/components/logo/logo';
import { Divider, Flex, View } from '@adobe/react-spectrum';
import CanvasHeader from './canvas-header';
import { isCanvas } from 'app/shared/util/common-utils';
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
      <LoadingBar className="loading-bar" />
      <View padding="size-150" backgroundColor="default">
        <header>
          <Flex justifyContent="space-between" alignSelf="center">
            <Flex justifyContent="center" alignItems="center">
              {/* TODO: will be replaced */}
              <Link to="/" style={{ color: 'black' }}>
                <Logo />
              </Link>
            </Flex>
            <Flex justifyContent="end">
              {props.isCanvas && (
                <React.Fragment>
                  <CanvasHeader />
                </React.Fragment>
              )}
            </Flex>
          </Flex>
          <div style={{ position: 'absolute', right: '-10px', top: '12px' }}>
            {' '}
            <DataStudioAvatar />
          </div>
        </header>
      </View>
    </>
  );
};

export default Header;
