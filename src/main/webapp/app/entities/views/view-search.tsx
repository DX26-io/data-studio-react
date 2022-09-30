import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex, SearchField } from '@adobe/react-spectrum';
import { translate } from 'react-jhipster';
import { getDashboardViewEntitiesByName } from 'app/entities/views/views.reducer';
import { IRootState } from 'app/shared/reducers';
import { debouncedSearch } from 'app/shared/util/common-utils';

const ViewSearch = props => {
  const [searchedText, setSearchedText] = React.useState('');

  const onChangeSearchedText = event => {
    setSearchedText(event);
    debouncedSearch(props.getDashboardViewEntitiesByName, [props.dashboardEntity.id, event]);
  };

  return (
    <Flex justifyContent="center" alignItems="center">
      <SearchField
        placeholder={translate('views.searchView')}
        onClear={() => {
          setSearchedText('');
        }}
        onChange={onChangeSearchedText}
        onSubmit={event => {
          setSearchedText(event);
          props.getDashboardViewEntitiesByName(props.dashboardEntity.id, event);
        }}
        value={searchedText}
        width="size-4600"
      />
    </Flex>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  dashboardEntity: storeState.dashboard.entity,
});

const mapDispatchToProps = { getDashboardViewEntitiesByName };

export default connect(mapStateToProps, mapDispatchToProps)(ViewSearch);
