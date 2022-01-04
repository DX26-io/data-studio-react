import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, getSortState, translate } from 'react-jhipster';
import TreeExpand from '@spectrum-icons/workflow/TreeExpand';
import {} from '../reports-management.reducer';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Select from 'react-select';
import { Button, Flex, TextField, Checkbox, Text, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { getDashboardsByName, getEntities as getDashboards } from 'app/entities/dashboard/dashboard.reducer';
import { getDashboardViewEntities, getViewsByName, getEntities as getViews } from 'app/entities/views/views.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getUsers, searchUsers } from 'app/modules/administration/user-management/users/user.reducer';
import { generateUsersOptions } from 'app/modules/administration/user-management/users/user.util';
import { fetchReports } from '../reports-management.reducer';
import { findUserId, isAdmin } from './reports.util';
import { generateDashboardNameOptions } from 'app/entities/dashboard/dashboard-util';
import { generateViewNameOptions } from 'app/entities/views/view-util';

export interface IFiltersProps extends StateProps, DispatchProps {}

export const Filters = (props: IFiltersProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const [searchedDahboard, setSearchedDahboard] = React.useState({ value: '', label: '' });
  const [searchedView, setSearchedView] = React.useState({ value: '', label: '' });
  const [searchedUser, setSearchedUser] = React.useState({ value: '', label: '' });
  const [reportName, setReportName] = React.useState('');
  const [isThresholdAlert, setThresholdAlert] = React.useState(false);

  // const [dashboardId, setDashboardId] = useState({ value: '', label: '' });
  // const [viewId, setViewId] = useState({ value: '', label: '' });

  useEffect(() => {
    props.getDashboards(0, ITEMS_PER_PAGE, 'id,asc');
    props.getViews(0, ITEMS_PER_PAGE, 'id,asc');
  }, []);

  const search = () => {
    props.fetchReports(
      ITEMS_PER_PAGE,
      0,
      findUserId(props.account, searchedUser.value),
      reportName,
      '',
      '',
      isThresholdAlert,
      searchedDahboard.label,
      searchedView.label
    );
  };

  const selectDashboard = selectedDashboard => {
    if (selectedDashboard) {
      setSearchedDahboard(selectedDashboard);
    } else {
      setSearchedDahboard({ value: '', label: '' });
    }
    setSearchedView({ value: '', label: '' });
    props.getDashboardViewEntities(selectedDashboard.value, 0, ITEMS_PER_PAGE, 'id,asc');
  };

  const selectView = selectedView => {
    if (selectedView) {
      setSearchedView(selectedView);
    } else {
      setSearchedView({ value: '', label: '' });
    }
  };

  const selectUser = selectedUser => {
    if (selectedUser) {
      setSearchedUser(selectedUser);
    } else {
      setSearchedUser({ value: '', label: '' });
    }
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
      }}
      style={{ marginBottom: '20px' }}
    >
      <AccordionSummary expandIcon={<TreeExpand size="S" />} aria-controls="panel1bh-content" id="panel1bh-header">
        <span className="spectrum-Body-emphasis">
          <Translate contentKey="reportsManagement.reports.filters.title">Filters</Translate>
        </span>
      </AccordionSummary>
      <AccordionDetails>
        <View marginBottom="size-400">
          <Flex direction="row" gap="size-250" justifyContent="center" alignItems="center">
            <div style={{ width: '250px' }}>
              <Select
                isClearable
                isSearchable
                value={searchedDahboard}
                placeholder={translate('dashboard.search')}
                label={translate('dashboard.select')}
                onChange={selectDashboard}
                onInputChange={event => {
                  if (event) {
                    setSearchedDahboard(event);
                    props.getDashboardsByName(event);
                  }
                }}
                options={generateDashboardNameOptions(props.dashboards)}
              />
            </div>
            <div style={{ width: '250px' }}>
              <Select
                isClearable
                isSearchable
                value={searchedView}
                placeholder={translate('views.searchView')}
                label={translate('views.select')}
                onChange={selectView}
                onInputChange={event => {
                  if (event) {
                    props.getViewsByName(event);
                  }
                }}
                options={generateViewNameOptions(props.views)}
              />
            </div>
            <div style={{ width: '250px' }}>
              <Select
                isClearable
                isSearchable
                value={searchedUser}
                placeholder={translate('userManagement.search')}
                label={translate('userManagement.select')}
                onChange={selectUser}
                onInputChange={event => {
                  if (event) {
                    props.searchUsers(0, ITEMS_PER_PAGE, 'login,asc', event);
                  }
                }}
                options={generateUsersOptions(props.searchedUsers)}
              />
            </div>
            <TextField
              placeholder={translate('reportsManagement.reports.filters.reportName')}
              onChange={setReportName}
              value={reportName}
            />
            <Checkbox onChange={setThresholdAlert} isEmphasized>
              <Translate contentKey="reportsManagement.reports.thresholdAlert">Threshold Alert</Translate>
            </Checkbox>
            <Button variant="cta" marginStart="size-150" onPress={search}>
              <Translate contentKey="entity.action.search">Search</Translate>
            </Button>
          </Flex>
        </View>
      </AccordionDetails>
    </Accordion>
  );
};

const mapDispatchToProps = {
  fetchReports,
  getDashboards,
  getDashboardsByName,
  getViews,
  getViewsByName,
  searchUsers,
  getDashboardViewEntities,
};

const mapStateToProps = (storeState: IRootState) => ({
  dashboards: storeState.dashboard.entities,
  views: storeState.views.entities,
  account: storeState.authentication.account,
  users: storeState.userManagement.users,
  searchedUsers: storeState.userManagement.searchedUsers,
});

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
