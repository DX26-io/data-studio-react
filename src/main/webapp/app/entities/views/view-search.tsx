import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex, SearchField } from '@adobe/react-spectrum';
import { translate } from 'react-jhipster';
import { getDashboardViewEntitiesByName } from 'app/entities/views/views.reducer';
import { IRootState } from 'app/shared/reducers';

const ViewSearch = props => {
  const [searchedText, setSearchedText] = React.useState('');
  let delayTimer;

  const getViews = text => {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      props.getDashboardViewEntitiesByName(props.dashboardEntity.id,text);
    }, 1000);
  };

  const onChangeSearchedText = event => {
    setSearchedText(event);
    if (event.length >= 2 || event.length === 0) {
      getViews(event);
    }
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
          props.getDashboardViewEntitiesByName(props.dashboardEntity.id,event);
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
