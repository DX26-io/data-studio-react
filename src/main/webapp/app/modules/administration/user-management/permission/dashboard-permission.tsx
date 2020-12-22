import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Grid, View, Text } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import UsersGroups from './users-groups';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import PermissionTitle from './permission-title';

export interface IDashboardPermissionProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const DashboardPermission = (props: IDashboardPermissionProps) => {
  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { key: 'home', label: 'Home', route: '/' },
          { key: 'user-management', label: 'User Management', route: '/administration/user-management' },
          {
            key: 'user-management-dashboard-permissions',
            label: 'Dashboard Permissions',
            route: '/administration/user-management/dashboard-permission',
          },
        ]}
        title={'Dashboard Permissions'}
      ></SecondaryHeader>

      <Grid areas={['users dashboards']} columns={['1fr', '2fr']} rows={['auto']} data-testid="permission-container">
        <View gridArea="users">
          <UsersGroups />
        </View>
        <View gridArea="dashboards" borderXWidth="thin" borderColor="default" >
          <PermissionTitle />
        </View>
      </Grid>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  // groups: storeState.userGroups.groups,
  // users: storeState.userManagement.users,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPermission);
