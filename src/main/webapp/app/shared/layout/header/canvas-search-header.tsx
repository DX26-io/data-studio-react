import './header.scss';
import React, { useState, useEffect, ReactText } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getEntities, getDashboardsByName } from 'app/entities/dashboard/dashboard.reducer';
import { generateDashboardNameOptions, generateViewNameOptions } from './header.util';
import { getDashboardViewEntities,getViewsByName} from 'app/entities/views/views.reducer';
import { useHistory } from 'react-router-dom';
import Dashboard from '@spectrum-icons/workflow/Dashboard';
import ViewedMarkAs from '@spectrum-icons/workflow/ViewedMarkAs';
import { Flex, View } from '@adobe/react-spectrum';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

const CanvasSearchHeader = props => {
  const [dashboardId, setDashboardId] = useState({ "value": '', "label": '' });

  const history = useHistory();

  useEffect(() => {
    props.getEntities(0, ITEMS_PER_PAGE, null);
  }, []);

  const handleInputChangeDashboard = (newValue: string) => {
    props.getDashboardsByName(newValue);
  };
  const handleInputChangeView = (newValue: string) => {
    if(newValue){
      props.getViewsByName(newValue);
    }
  };

  return (
    <>
      <Flex direction="row" gap={"size-125"}>
        <Flex direction="row" alignItems={"center"}>
          <View marginX={"size-100"}> <Dashboard aria-label="Dashboard" /></View>
          <View width={"size-2400"}>
            <Select value={{ "value": props.view?.viewDashboard?.id?.toString(), "label": props.view?.viewDashboard?.dashboardName }} placeholder="Select dashboard" onChange={event => {
              if (event) {
                setDashboardId(event);

                props.getDashboardViewEntities(event.value,0, ITEMS_PER_PAGE, 'id,asc');
              }
            }}
              onInputChange={handleInputChangeDashboard}
              options={generateDashboardNameOptions(props.dashboardList)} /></View>
        </Flex>
        <Flex direction="row" alignItems={"center"}>
          <View marginEnd={"size-100"}><ViewedMarkAs aria-label="ViewedMarkAs" /></View>
          <View width={"size-2400"}>
            <Select value={{ "value": props.view?.id?.toString(), "label": props.view?.viewName }} placeholder="Select view" onChange={event => {
              if (event) {
                history.push(`/dashboards/build?dahsbordId=${dashboardId.value}&viewId=${event.value}`);
              }
            }}
              onInputChange={handleInputChangeView}
              options={generateViewNameOptions(props.viewList)} />
          </View>
        </Flex>
      </Flex>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  dashboardList: storeState.dashboard.entities,
  viewList: storeState.views.entities,
  view: storeState.views.entity,

});

const mapDispatchToProps = {
  getEntities,
  getDashboardViewEntities,
  getDashboardsByName
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasSearchHeader);