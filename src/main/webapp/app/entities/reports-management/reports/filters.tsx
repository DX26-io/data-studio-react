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
import { ComboBox, Item, Section } from '@react-spectrum/combobox';
import { IRootState } from 'app/shared/reducers';
import { getDashboardsByName, getEntities as getDashboards } from 'app/entities/dashboard/dashboard.reducer';
import { getViewsByName, getEntities as getViews } from 'app/entities/views/views.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getUsers, searchUsers } from 'app/modules/administration/user-management/users/user.reducer';
import { fetchReports } from '../reports-management.reducer';
import { findUserId, isAdmin } from './reports.util';

export interface IFiltersProps extends StateProps, DispatchProps {}

export const Filters = (props: IFiltersProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const [searchedDahboard, setSearchedDahboard] = React.useState('');
  const [searchedView, setSearchedView] = React.useState('');
  const [searchedUser, setSearchedUser] = React.useState('');
  const [reportName, setReportName] = React.useState('');
  const [isThresholdAlert, setThresholdAlert] = React.useState(false);

  useEffect(() => {
    props.getDashboards(0, ITEMS_PER_PAGE, 'id,asc');
    props.getViews(0, ITEMS_PER_PAGE, 'id,asc');
  }, []);

  const search = () => {
    props.fetchReports(
      ITEMS_PER_PAGE,
      0,
      findUserId(props.account, searchedUser),
      reportName,
      '',
      '',
      isThresholdAlert,
      searchedDahboard,
      searchedView
    );
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
          <Translate contentKey="reports-management.reports.filters.title">Filters</Translate>
        </span>
      </AccordionSummary>
      <AccordionDetails>
        <View marginBottom="size-400">
          <Flex direction="row" gap="size-250" justifyContent="center" alignItems="center">
            <ComboBox
              placeholder={translate('dashboard.search')}
              label={translate('dashboard.select')}
              defaultItems={props.dashboards}
              items={props.dashboards}
              inputValue={searchedDahboard}
              onInputChange={event => {
                setSearchedDahboard(event);
                props.getDashboardsByName(event);
              }}
            >
              {item => <Item>{item.dashboardName}</Item>}
            </ComboBox>
            <ComboBox
              placeholder={translate('views.search')}
              label={translate('views.select')}
              defaultItems={props.views}
              items={props.views}
              inputValue={searchedView}
              onInputChange={event => {
                setSearchedView(event);
                props.getViewsByName(event);
              }}
            >
              {item => <Item>{item.viewName}</Item>}
            </ComboBox>
            {isAdmin(props.account) ? (
              <ComboBox
                placeholder={translate('userManagement.search')}
                label={translate('userManagement.select')}
                defaultItems={props.users}
                items={props.users}
                inputValue={searchedUser}
                onInputChange={event => {
                  setSearchedUser(event);
                  props.searchUsers(0, ITEMS_PER_PAGE, 'login,asc', event);
                }}
              >
                {item => <Item>{item.login}</Item>}
              </ComboBox>
            ) : null}
            {/* TODO : start date and end date will be added into filters once date component is ready */}
            <TextField label={translate('reportsManagement.reports.filters.reportName')} onChange={setReportName} value={reportName} />
            <Checkbox onChange={setThresholdAlert} isEmphasized marginTop="size-300">
              <Translate contentKey="reports-management.reports.thresholdAlert">Threshold Alert</Translate>
            </Checkbox>
            <Button variant="cta" marginTop="size-300" marginStart="size-150" onPress={search}>
              <Translate contentKey="entity.action.search">Search</Translate>
            </Button>
          </Flex>
        </View>
      </AccordionDetails>
    </Accordion>
  );
};

const mapDispatchToProps = { fetchReports, getDashboards, getDashboardsByName, getViews, getViewsByName, searchUsers };

const mapStateToProps = (storeState: IRootState) => ({
  dashboards: storeState.dashboard.entities,
  views: storeState.views.entities,
  account: storeState.authentication.account,
  users: storeState.userManagement.users,
});

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
