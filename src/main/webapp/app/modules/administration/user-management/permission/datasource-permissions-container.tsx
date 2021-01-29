import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, View, Text } from '@adobe/react-spectrum';
import UsersGroups from './users-groups';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import PermissionsTitle from './permissions-title';
import Datasource from './datasource-permissions';
import { IRootState } from 'app/shared/reducers';
import { updateUserGroupPermissions, updateUserPermissions, resetViewsPermissions } from './permissions.reducer';
import { connect } from 'react-redux';
import { findViewsPermissionsChanges } from './permissions-util';

export interface IDatasourcePermissionContainerProps extends StateProps, DispatchProps, RouteComponentProps {}

export const DatasourcePermissionContainer = (props: IDatasourcePermissionContainerProps) => {
  const handleSaveClick = () => {
    const params = new URLSearchParams(props.location.search);
    const groupName = params.get('group');
    const login = params.get('user');
    const permissionChanges = findViewsPermissionsChanges(props.datasourcePermissions);
    if (login) {
      props.updateUserPermissions(permissionChanges, login);
    } else if (groupName) {
      props.updateUserGroupPermissions(permissionChanges, groupName);
    }
  };

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
          <PermissionsTitle handleSaveClick={handleSaveClick} />
          <Datasource permissionProps={props} />
        </View>
      </Grid>
    </div>
  );
};
const mapStateToProps = (storeState: IRootState) => ({
  datasourcePermissions: storeState.permissions.datasourcePermissions,
  totalDatasourcePermissions: storeState.permissions.totalDatasourcePermissions,
});
const mapDispatchToProps = {
  updateUserGroupPermissions,
  updateUserPermissions,
  resetViewsPermissions,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourcePermissionContainer);
