import React, { useEffect } from 'react';
import { translate } from 'react-jhipster';
import DataStudioAvatar from 'app/shared/layout/header/partials/data-studio-avatar';
import Logo from 'app/shared/components/logo/logo';
import { Flex, View, SearchField } from '@adobe/react-spectrum';
import { connect } from 'react-redux';
import { getDashboardsByName } from 'app/entities/dashboard/dashboard.reducer';
import { getViewsByName } from 'app/entities/views/views.reducer';
import { updateSearchedText } from './home.reducer';

export interface IHomeHeaderProps extends DispatchProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isSwaggerEnabled: boolean;
  currentLocale: string;
  onLocaleChange: Function;
}

const Header = (props: IHomeHeaderProps) => {
  const [searchedText, setSearchedText] = React.useState('');

  const onChangeSearchedText = event => {
    setSearchedText(event);
    if (!event || event === '') {
      props.updateSearchedText('');
    }
  };

  return (
    <View
      paddingX="size-150"
      paddingY="size-100"
      backgroundColor="gray-75"
      borderBottomWidth={'thin'}
      borderTopWidth={'thin'}
      borderBottomColor={'light'}
      borderTopColor={'light'}
    >
      <header>
        <Flex justifyContent="space-between">
          <Flex alignItems="start">
            <Logo />
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <SearchField
              placeholder={translate('home.header.search')}
              onClear={() => {
                setSearchedText('');
                props.updateSearchedText('');
              }}
              onChange={onChangeSearchedText}
              onSubmit={event => {
                setSearchedText(event);
                props.getDashboardsByName(searchedText);
                props.getViewsByName(searchedText);
                props.updateSearchedText(searchedText);
              }}
              value={searchedText}
              width="size-4600"
            />
          </Flex>
          <Flex alignItems="end">
            <DataStudioAvatar />
          </Flex>
        </Flex>
      </header>
    </View>
  );
};

const mapDispatchToProps = { getDashboardsByName, getViewsByName, updateSearchedText };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(Header);
