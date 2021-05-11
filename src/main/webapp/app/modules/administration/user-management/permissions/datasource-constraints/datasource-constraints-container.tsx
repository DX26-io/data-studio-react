import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, View, DialogContainer } from '@adobe/react-spectrum';
import UsersGroups from '../users-groups';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import DatasourceConstraints from './datasource-constraints';
import PermissionsActionTitle from '../permissions-action-title';
import DatasourceConstraintUpdate from './datasource-constraint-update';

export interface IDatasourceConstraintsContainerProps extends StateProps, DispatchProps, RouteComponentProps {}

export const DatasourceConstraintsContainer = (props: IDatasourceConstraintsContainerProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isNew, setIsNew] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
    // const params = new URLSearchParams(props.location.search);
    // const groupName = params.get('group');
    // const login = params.get('user');
    // if (login) {
    //   props.updateUserPermissions(permissionChanges, login);
    // } else if (groupName) {
    //   props.updateUserGroupPermissions(permissionChanges, groupName);
    // }
  };

  const setUpdateSuccess = () => {};

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
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && (
          <DatasourceConstraintUpdate setUpdateSuccess={setUpdateSuccess} setOpen={setOpen} {...props}></DatasourceConstraintUpdate>
        )}
      </DialogContainer>
      <Grid areas={['users datasources']} columns={['1fr', '2fr']} rows={['auto']} data-testid="permission-container">
        <View gridArea="users">
          <UsersGroups permissionProps={props} />
        </View>
        <View gridArea="datasources" borderXWidth="thin" borderColor="default" height="100vh">
          <PermissionsActionTitle handleClick={handleClick} updating={props.updating} translateActionKey="entity.action.create" />
          <DatasourceConstraints routeProps={props} />
        </View>
      </Grid>
    </div>
  );
};
const mapStateToProps = (storeState: IRootState) => ({
  updating: storeState.datasourceConstraints.updating,
});
const mapDispatchToProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourceConstraintsContainer);
