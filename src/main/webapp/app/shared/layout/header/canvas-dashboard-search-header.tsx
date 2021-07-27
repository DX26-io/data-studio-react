import './header.scss';
import React, { useState, useEffect, ReactText } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getAllEntities } from 'app/entities/dashboard/dashboard.reducer';
import { generateDashboardNameOptions, generateViewNameOptions } from './header.util';
import { getViewByDashboardId } from 'app/entities/views/views.reducer';
import { useHistory } from 'react-router-dom';
import Dashboard from '@spectrum-icons/workflow/Dashboard';
import ViewedMarkAs from '@spectrum-icons/workflow/ViewedMarkAs';
import { Flex, View } from '@adobe/react-spectrum';

const CanvasDashboardSearchHeader = props => {
  const [dashboardId, setDashboardId] = useState({ "value": '', "label": '' });
  const [viewId, setViewId] = useState({ "value": '', "label": '' });

  const history = useHistory();

  useEffect(() => {
    if (props.view.id) {
      setDashboardId({ "value": props.view?.viewDashboard?.id?.toString(), "label": props.view?.viewDashboard?.dashboardName });
      setViewId({ "value": props.view?.id?.toString(), "label": props.view?.viewName });
    }
  }, [props.view]);

  useEffect(() => {
    props.getAllEntities();
  }, []);

  return (
    <>
      <Flex direction="row" gap={"size-125"}>
        <Flex direction="row" alignItems={"center"}>
          <View marginX={"size-100"}> <Dashboard aria-label="Dashboard" /></View>
          <View width={"size-2400"}>
            <Select value={dashboardId} placeholder="Select dashboard" onChange={event => {
              if (event) {
                setDashboardId(event);
                props.getViewByDashboardId(event.value);
              }
            }}
              options={generateDashboardNameOptions(props.dashboardList)} /></View>
        </Flex>
        <Flex direction="row" alignItems={"center"}>
          <View marginEnd={"size-100"}><ViewedMarkAs aria-label="ViewedMarkAs" /></View>
          <View width={"size-2400"}>
            <Select value={viewId} placeholder="Select view" onChange={event => {
              if (event) {
                history.push(`/dashboards/build?dahsbordId=${dashboardId.value}&viewId=${event.value}`);
              }
            }}
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
  getAllEntities,
  getViewByDashboardId
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasDashboardSearchHeader);