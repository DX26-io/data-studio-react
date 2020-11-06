import './header.scss';

import React from 'react';
import { Storage, Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';
import Notifications from 'app/shared/layout/header/partials/notifications';
import DataStudioAvatar from 'app/shared/layout/header/partials/data-studio-avatar';
import Logo from 'app/shared/components/logo/logo';
import { Flex, View } from '@adobe/react-spectrum';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isSwaggerEnabled: boolean;
  currentLocale: string;
  onLocaleChange: Function;
}

const Header = (props: IHeaderProps) => {
  // TODO fix the UI issues with the header icons
  // TODO use the below method in user preferences page
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

  return (
    <>
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />
      <View padding="size-150" backgroundColor="static-black">
        <header>
          <Flex justifyContent="space-between">
            <Flex justifyContent="center" alignItems="center">
              <Logo />
            </Flex>
            <Flex alignItems="end">
              <Notifications />
              <DataStudioAvatar />
            </Flex>
          </Flex>
        </header>
      </View>
    </>
  );
};

export default Header;