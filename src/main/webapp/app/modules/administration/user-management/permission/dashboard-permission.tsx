import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Grid, View, Text } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import UsersGroups from './users-groups';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import PermissionTitle from './permission-title';
import Dashboards from './dashboards';

export interface IDashboardPermissionProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const DashboardPermission = (props: IDashboardPermissionProps) => {

  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'User Management', route: '/administration/user-management' },
          {
            label: 'Dashboard Permissions',
            route: '/administration/user-management/dashboard-permission',
          },
        ]}
        title={'Dashboard Permissions'}
      ></SecondaryHeader>

      <Grid areas={['users dashboards']} columns={['1fr', '2fr']} rows={['auto']} data-testid="permission-container">
        <View gridArea="users">
          <UsersGroups permissionProps={props} />
        </View>
        <View gridArea="dashboards" borderXWidth="thin" borderColor="default" height="100vh">
          <PermissionTitle />
          <Dashboards permissionProps={props}/>
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
