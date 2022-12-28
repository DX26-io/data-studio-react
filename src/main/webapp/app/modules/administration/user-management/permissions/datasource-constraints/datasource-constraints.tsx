import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, View, DialogContainer } from '@adobe/react-spectrum';
import UsersGroups from '../users-groups';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import UserDatasourceConstraints from './users/user-datasource-constraints';
import UserGroupDatasourceConstraints from './groups/user-group-datasource-constraints';
import PermissionsActionTitle from '../permissions-action-title';
import UserDatasourceConstraintUpdate from './users/user-datasource-constraint-update';
import UserGroupDatasourceConstraintUpdate from './groups/user-group-datasource-constraint-update';

export interface IDatasourceConstraintsProps extends StateProps, DispatchProps, RouteComponentProps {}

export const DatasourceConstraints = (props: IDatasourceConstraintsProps) => {
  const [isUserDatasourceConstraintDialogOpen, setUserDatasourceConstraintDialogOpen] = React.useState(false);
  const [isUserGroupDatasourceConstraintDialogOpen, setUserGroupDatasourceConstraintDialogOpen] = React.useState(false);


  const handleClick = () => {
    if (props.searchUrl.includes('user')) {
      setUserDatasourceConstraintDialogOpen(true);
    } else {
      setUserGroupDatasourceConstraintDialogOpen(true);
    }
  };

  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('userManagement.home.title'), route: '/administration/user-management' },
          {
            label: translate('permissions.datasourceConstraints.title'),
            route: '/administration/user-management/datasource-constraints',
          },
        ]}
        title={translate('permissions.datasourceConstraints.title')}
      ></SecondaryHeader>
      <DialogContainer onDismiss={() => setUserDatasourceConstraintDialogOpen(false)}>
        {isUserDatasourceConstraintDialogOpen && <UserDatasourceConstraintUpdate setOpen={setUserDatasourceConstraintDialogOpen} />}
        {isUserGroupDatasourceConstraintDialogOpen && (
          <UserGroupDatasourceConstraintUpdate setOpen={setUserGroupDatasourceConstraintDialogOpen} />
        )}
      </DialogContainer>
      <Grid areas={['users datasources']} columns={['1fr', '2fr']} rows={['auto']} data-testid="permission-container">
        <View gridArea="users">
          <UsersGroups permissionProps={props} />
        </View>
        <View gridArea="datasources" borderXWidth="thin" borderColor="default" height="100vh">
          <PermissionsActionTitle handleClick={handleClick} updating={props.updating} translateActionKey="entity.action.create" />
          {props.searchUrl.includes('user') ? (
            <UserDatasourceConstraints setOpen={setUserDatasourceConstraintDialogOpen} />
          ) : (
            <UserGroupDatasourceConstraints setOpen={setUserGroupDatasourceConstraintDialogOpen} />
          )}
        </View>
      </Grid>
    </div>
  );
};
const mapStateToProps = (storeState: IRootState) => ({
  updating: storeState.userDatasourceConstraints.updating,
  searchUrl: storeState.permissions.searchUrl,
});
const mapDispatchToProps = {  };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourceConstraints);
