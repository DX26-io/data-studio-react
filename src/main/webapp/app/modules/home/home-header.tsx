import React from 'react';
import { Storage, Translate, translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';
import DataStudioAvatar from 'app/shared/layout/header/partials/data-studio-avatar';
import Logo from 'app/shared/components/logo/logo';
import { Flex, View, SearchField } from '@adobe/react-spectrum';

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
  const [currentText, setCurrentText] = React.useState('');
  const [submittedText, setSubmittedText] = React.useState('');

  return (
    <>
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
                onClear={() => setCurrentText('')}
                onChange={setCurrentText}
                onSubmit={setSubmittedText}
                value={currentText}
                width="size-4600"
              />
            </Flex>
            <Flex alignItems="end">
              <DataStudioAvatar />
            </Flex>
          </Flex>
        </header>
      </View>
    </>
  );
};

export default Header;
