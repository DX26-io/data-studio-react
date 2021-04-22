import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Grid, View, Text } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import UsersGroups from './users-groups';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import PermissionsTitle from './permissions-title';
import Dashboards from './dashboards-permissions';
import { translate,Translate } from 'react-jhipster';

export const DashboardPermissionContainer = (props: RouteComponentProps) => {
  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'User Management', route: '/administration/user-management' },
          {
            label: 'Dashboard Permissions',
            route: '/administration/user-management/dashboard-permissions',
          },
        ]}
        title={translate('permissions.dashboardPermissions.title')}
      ></SecondaryHeader>

      <Grid areas={['users dashboards']} columns={['1fr', '2fr']} rows={['auto']} data-testid="permission-container">
        <View gridArea="users">
          <UsersGroups permissionProps={props} />
        </View>
        <View gridArea="dashboards" borderXWidth="thin" borderColor="default" height="100vh">
          <PermissionsTitle />
          <Dashboards permissionProps={props} />
        </View>
      </Grid>
    </div>
  );
};

export default DashboardPermissionContainer;
