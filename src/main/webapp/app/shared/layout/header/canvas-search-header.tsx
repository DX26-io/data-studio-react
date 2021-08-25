import './header.scss';
import React, { useState, useEffect, ReactText } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getEntities as getDashboards, getDashboardsByName } from 'app/entities/dashboard/dashboard.reducer';
import { generateDashboardNameOptions, generateViewNameOptions } from './header.util';
import { getDashboardViewEntities, getViewsByName } from 'app/entities/views/views.reducer';
import { useHistory } from 'react-router-dom';
import { Flex, View, ActionButton, Button, Content, Dialog, DialogTrigger } from '@adobe/react-spectrum';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import Apps from '@spectrum-icons/workflow/Apps';

const CanvasSearchHeader = props => {
  const [dashboardId, setDashboardId] = useState({ value: '', label: '' });
  const [viewId, setViewId] = useState({ value: '', label: '' });

  const history = useHistory();

  useEffect(() => {
    props.getDashboards(0, ITEMS_PER_PAGE, null);
  }, []);

  useEffect(() => {
    if (props.view?.viewDashboard?.id) {
      setDashboardId({ value: props.view?.viewDashboard?.id.toString(), label: props.view?.viewDashboard?.dashboardName });
      setViewId({ value: props.view?.id?.toString(), label: props.view?.viewName });
      props.getDashboardViewEntities(props.view?.viewDashboard?.id, 0, ITEMS_PER_PAGE, 'id,asc');
    }
  }, [props.view]);

  const selectDashboard = selectedDashboard => {
    // const _selectedDashboard = props.dashboardList.filter(dashboard => dashboard.id === selectedDashboard.value)[0];
    setDashboardId({ value: selectedDashboard.value, label: selectedDashboard.label });
    setViewId({ value: '', label: '' });
    props.getDashboardViewEntities(selectedDashboard.value, 0, ITEMS_PER_PAGE, 'id,asc');
  };

  const selectView = selectedView => {
    setViewId({ value: selectedView.value, label: selectedView.label });
    history.push(`/dashboards/build?dashboardId=${dashboardId.value}&viewId=${selectedView.value}`);
    history.go(0);
  };

  const handleInputChangeDashboard = (newValue: string) => {
    props.getDashboardsByName(newValue);
  };
  const handleInputChangeView = (newValue: string) => {
    if (newValue) {
      props.getViewsByName(newValue);
    }
  };

  return (
    <DialogTrigger type="popover">
      <ActionButton aria-label="User avatar" isQuiet={true} marginEnd="size-200" data-testid="avatarButton">
        <Apps size="M" />
      </ActionButton>
      <Dialog>
        <Content>
          <Flex direction="column" gap="size-100">
            <View padding={10} margin={5} backgroundColor="gray-75">
              <span className="spectrum-Body-emphasis--sizeXXS">Dashboard</span>
              <div style={{ marginTop: '5px' }}>
                <Select
                  value={dashboardId}
                  placeholder="Select dashboard"
                  onChange={selectDashboard}
                  onInputChange={handleInputChangeDashboard}
                  options={generateDashboardNameOptions(props.dashboardList)}
                />
              </div>
            </View>
            <View padding={10} margin={5} backgroundColor="gray-75">
              <span className="spectrum-Body-emphasis--sizeXXS">View</span>
              <div style={{ marginTop: '5px' }}>
                <Select
                  value={viewId}
                  placeholder="Select view"
                  onChange={selectView}
                  onInputChange={handleInputChangeView}
                  options={generateViewNameOptions(props.viewList)}
                />
              </div>
            </View>
          </Flex>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  dashboardList: storeState.dashboard.entities,
  viewList: storeState.views.entities,
  view: storeState.views.entity,
});

const mapDispatchToProps = {
  getDashboards,
  getDashboardViewEntities,
  getDashboardsByName,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CanvasSearchHeader);
