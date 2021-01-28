import React, { useEffect } from 'react';
import {  RouteComponentProps } from 'react-router-dom';
import { Grid, View, Text } from '@adobe/react-spectrum';
import UsersGroups from './users-groups';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import PermissionsTitle from './permissions-title';
import Datasource from './datasource-permissions';

export const DatasourcePermissionContainer = (props: RouteComponentProps) => {
  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'User Management', route: '/administration/user-management' },
          {
            label: 'Datasource Permissions',
            route: '/administration/user-management/datasource-permissions',
          },
        ]}
        title={'Datasource Permissions'}
      ></SecondaryHeader>

      <Grid areas={['users datasources']} columns={['1fr', '2fr']} rows={['auto']} data-testid="permission-container">
        <View gridArea="users">
          <UsersGroups permissionProps={props} />
        </View>
        <View gridArea="datasources" borderXWidth="thin" borderColor="default" height="100vh">
          <PermissionsTitle />
          <Datasource permissionProps={props} />
        </View>
      </Grid>
    </div>
  );
};

export default DatasourcePermissionContainer;
