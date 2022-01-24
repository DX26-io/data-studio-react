import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, View, DialogContainer } from '@adobe/react-spectrum';
import UsersGroups from '../../users-groups';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import UserDatasourceConstraints from './user-datasource-constraints';
import PermissionsActionTitle from '../../permissions-action-title';
import DatasourceConstraintUpdate from './user-datasource-constraint-update';
import { receiveSocketResponse } from 'app/shared/websocket/websocket.reducer';

export interface IUserDatasourceConstraintsContainerProps extends StateProps, DispatchProps, RouteComponentProps {}

export const UserDatasourceConstraintsContainer = (props: IUserDatasourceConstraintsContainerProps) => {
  const [isOpen, setOpen] = React.useState(false);

  useEffect(() => {
    props.receiveSocketResponse();
  }, []);

  const handleClick = () => {
    setOpen(true);
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
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && (
          <DatasourceConstraintUpdate setOpen={setOpen} {...props}></DatasourceConstraintUpdate>
        )}
      </DialogContainer>
      <Grid areas={['users datasources']} columns={['1fr', '2fr']} rows={['auto']} data-testid="permission-container">
        <View gridArea="users">
          <UsersGroups permissionProps={props} />
        </View>
        <View gridArea="datasources" borderXWidth="thin" borderColor="default" height="100vh">
          <PermissionsActionTitle handleClick={handleClick} updating={props.updating} translateActionKey="entity.action.create" />
          <UserDatasourceConstraints routeProps={props} setOpen={setOpen} />
        </View>
      </Grid>
    </div>
  );
};
const mapStateToProps = (storeState: IRootState) => ({
  updating: storeState.datasourceConstraints.updating,
});
const mapDispatchToProps = { receiveSocketResponse };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserDatasourceConstraintsContainer);
