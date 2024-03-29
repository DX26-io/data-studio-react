import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  getUserViewsPermissions,
  getUserGroupViewsPermissions,
  updateUserGroupPermissions,
  updateUserPermissions,
  resetViewsPermissions,
} from '../permissions.reducer';
import { IRootState } from 'app/shared/reducers';
import {
  Flex,
  Dialog,
  Text,
  SearchField,
  Header,
  Button,
  useDialogContainer,
  Heading,
  Divider,
  Content,
  Checkbox,
} from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { ITEMS_PER_PAGE, ACTIVE_PAGE, ITEMS_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { Translate, getSortState } from 'react-jhipster';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { findViewsPermissionsChanges } from '../permissions-util';

export interface IViewsPermissionsProps extends StateProps, DispatchProps {
  permissionProps: any;
  setOpen: (isOpen: boolean) => void;
  group: string;
  user: string;
  id: number;
  dashboardName: string;
  setUpdateSuccess: () => void;
}

export const ViewsPermissions = (props: IViewsPermissionsProps) => {
  const {
    viewsPermissions,
    totalViewsPermissions,
    updating,
    updateSuccess,
    permissionProps,
    group,
    user,
    id,
    setOpen,
    dashboardName,
    setUpdateSuccess,
  } = props;
  const dialog = useDialogContainer();
  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(permissionProps.location, ITEMS_PER_PAGE), permissionProps.location.search)
  );

  const fetchPermissions = () => {
    if (user) {
      props.getUserViewsPermissions(pagination.activePage, pagination.itemsPerPage, user, id);
    } else if (group) {
      props.getUserGroupViewsPermissions(pagination.activePage, pagination.itemsPerPage, group, id);
    }
  };

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    props.resetViewsPermissions();
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
      setUpdateSuccess();
    }
  }, [updateSuccess]);

  useEffect(() => {
    fetchPermissions();
  }, [pagination.activePage, pagination.itemsPerPage, user, group, id]);

  const handleChangePage = (event, newPage) => {
    setPagination({
      ...pagination,
      activePage: newPage,
    });
  };

  const handleChangeRowsPerPage = event => {
    setPagination({
      ...pagination,
      itemsPerPage: +event.target.value,
    });
  };

  const save = () => {
    const permissionChanges = findViewsPermissionsChanges(viewsPermissions);
    if (user) {
      props.updateUserPermissions(permissionChanges, user);
    } else if (group) {
      props.updateUserGroupPermissions(permissionChanges, group);
    }
  };

  

  return (
    <Dialog data-testid="views-permissions-dialog" width="90vw" top="3vh">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="group-form-heading">
          <Translate contentKey="permissions.viewsPermissions.title">Edit permissions for Administrators - </Translate>
          <Text>{dashboardName}</Text>
        </Flex>
      </Heading>
      <Header data-testid="group-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="permissions-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={save} isDisabled={updating} data-testid="permissions-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <TableContainer>
          <Table aria-label="customized table">
            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center">
                <Translate contentKey="permissions.viewsPermissions.viewName">VIEW NAME</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.read">READ</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.write">WRITE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.update">UPDATE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.delete">DELETE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.read_published"></Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.delete_published">DELETE</Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.release_published"></Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.request_published"></Translate>
              </TableCell>
              <TableCell align="center">
                <Translate contentKey="permissions.manage_published"></Translate>
              </TableCell>
            </TableHead>
            <TableBody>
              {viewsPermissions.map((view, i) => (
                <TableRow key={`view-${view.info.viewName}`}>
                  <TableCell align="center">{view.info.viewName}</TableCell>
                  {view.info.permissionMetadata.map((p, j) => (
                    <TableCell align="center" key={`permission-${p.permission.key.action}`}>
                      <Checkbox
                        data-testid={`checkbox-${p.permission.key.action}`}
                        defaultSelected={p.hasIt}
                        isEmphasized
                        onChange={() => {
                          p.value = p.hasIt;
                          p.hasIt = !p.hasIt;
                        }}
                      ></Checkbox>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          onPageChange={handleChangePage}
          component="div"
          count={totalViewsPermissions}
          rowsPerPage={pagination.itemsPerPage}
          page={pagination.activePage}
        />
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  viewsPermissions: storeState.permissions.viewsPermissions,
  totalViewsPermissions: storeState.permissions.totalViewsPermissions,
  updating: storeState.permissions.updating,
  updateSuccess: storeState.permissions.updateSuccess,
});

const mapDispatchToProps = {
  getUserViewsPermissions,
  getUserGroupViewsPermissions,
  updateUserGroupPermissions,
  updateUserPermissions,
  resetViewsPermissions,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ViewsPermissions);
