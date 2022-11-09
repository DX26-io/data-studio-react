import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex, SearchField } from '@adobe/react-spectrum';
import { translate } from 'react-jhipster';
import { getDashboardsByName } from './dashboard.reducer';
import { debouncedSearch } from 'app/shared/util/common-utils';

const DashboardSearch = props => {
  const [searchedText, setSearchedText] = React.useState('');

  const onChangeSearchedText = event => {
    setSearchedText(event);
    debouncedSearch(props.getDashboardsByName,[event]);
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
