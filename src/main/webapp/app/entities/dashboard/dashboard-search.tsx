import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex, SearchField } from '@adobe/react-spectrum';
import { translate } from 'react-jhipster';
import { getDashboardsByName } from './dashboard.reducer';

const DashboardSearch = props => {
  const [searchedText, setSearchedText] = React.useState('');
  let delayTimer;

  const getDashboards = text => {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      props.getDashboardsByName(text);
    }, 1000);
  };

  const onChangeSearchedText = event => {
    setSearchedText(event);
    if (event.length >= 2 || event.length === 0) {
      getDashboards(event);
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center">
      <SearchField
        placeholder={translate('dashboard.search')}
        onClear={() => {
          setSearchedText('');
        }}
        onChange={onChangeSearchedText}
        onSubmit={event => {
          setSearchedText(event);
          props.getDashboardsByName(event);
        }}
        value={searchedText}
        width="size-4600"
      />
    </Flex>
  );
};

const mapDispatchToProps = { getDashboardsByName };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(DashboardSearch);
