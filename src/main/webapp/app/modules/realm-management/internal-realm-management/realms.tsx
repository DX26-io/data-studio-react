import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Translate, getSortState, translate, IPaginationBaseState } from 'react-jhipster';
import { ITEMS_PER_PAGE_OPTIONS, ITEMS_PER_PAGE, ACTIVE_PAGE } from 'app/shared/util/pagination.constants';
import { getRealms, updateStatus, setRealm } from './realm.reducer';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, DialogContainer, SearchField, View } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { overridePaginationStateWithQueryParams } from './realm.utils';
import ConfirmationDialog from 'app/shared/components/confirmation-dialog';
import { debouncedSearch } from 'app/shared/util/common-utils';

export interface IRealmsProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Realms = (props: IRealmsProps) => {
  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  const [isOpen, setOpen] = React.useState(false);
  const [searchedRealmValue, setSearchedRealmValue] = React.useState('');
  const [searchedOrgValue, setSearchedOrgValue] = React.useState('');
  const [organisationId, setOrganisationId] = React.useState(null);

  const fetchUsersRealms = () => {
    const params = new URLSearchParams(props.location.search);
    const orgId = params.get('organisationId');
    let endURL = '';
    if (orgId) {
      setOrganisationId(orgId);
      props.getRealms(pagination.activePage, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`, null, null, Number(orgId));
      endURL = `?organisationId=${orgId}&page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    } else {
      props.getRealms(pagination.activePage, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`, null, null, null);
      endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    }
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    fetchUsersRealms();
  }, [pagination.activePage, pagination.order, pagination.sort, pagination.itemsPerPage, organisationId]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
        organisationId,
      });
    }
  }, [props.location.search]);

  const setUpdateSuccess = () => {
    fetchUsersRealms();
  };

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

  const { realms, match, totalItems } = props;

  const onClickButton = realm => {
    setOpen(true);
    props.setRealm(realm);
  };

  const _updateStatus = (isActive, id) => {
    props.updateStatus(isActive, id);
  };

  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: translate('realms.title'), route: '/administration/realm-management' },
        ]}
        title={translate('realms.title')}
      ></SecondaryHeader>
      <View margin="size-150">
        <Flex direction="row" gap="size-150">
          <SearchField
            value={searchedRealmValue}
            minWidth={'200px'}
            onChange={event => {
              setSearchedRealmValue(event);
              debouncedSearch(props.getRealms, [
                pagination.activePage,
                pagination.itemsPerPage,
                `${pagination.sort},${pagination.order}`,
                event,
                null,
                null,
              ]);
            }}
            placeholder={translate('realms.search')}
          />
          <SearchField
            value={searchedOrgValue}
            minWidth={'200px'}
            onChange={event => {
              setSearchedOrgValue(event);
              debouncedSearch(props.getRealms, [
                pagination.activePage,
                pagination.itemsPerPage,
                `${pagination.sort},${pagination.order}`,
                null,
                event,
                null,
              ]);
            }}
            placeholder={translate('organisations.search')}
          />
        </Flex>
      </View>
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && (
          <ConfirmationDialog
            updateSuccess={props.updateSuccess}
            entity={props.realm}
            updateStatus={_updateStatus}
            setOpen={setOpen}
            setUpdateSuccess={setUpdateSuccess}
            updateContentKey="realms.update"
            titleContentKey="realms.realm"
            confirmMessageContentKey="realms.confirmMessage"
            updating={props.updating}
          />
        )}
      </DialogContainer>
      <div className="dx26-container">
        <Paper className="dx26-table-pager">
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="realms.name">Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="realms.status">Status</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="organisations.name">Organisation Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="realms.createdBy">Created By</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {realms.map((realm, i) => (
                  <TableRow key={`realm-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      {realm.id}
                    </TableCell>
                    <TableCell align="center">{realm.name}</TableCell>
                    <TableCell align="center">
                      {realm.isActive ? (
                        <Translate contentKey="realms.enabled">Enabled</Translate>
                      ) : (
                        <Translate contentKey="realms.disabled">Disabled</Translate>
                      )}
                    </TableCell>
                    <TableCell align="center">{realm.realmOrganisation.name}</TableCell>
                    <TableCell align="center">{realm.createdBy}</TableCell>
                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center" alignItems="center">
                        {realm.isActive ? (
                          <Button variant="cta" type="submit" onPress={() => onClickButton(realm)}>
                            <Translate contentKey="realms.deactivate">Deactivate</Translate>
                          </Button>
                        ) : (
                          <Button variant="primary" type="submit" onPress={() => onClickButton(realm)}>
                            <Translate contentKey="realms.activate">Activate</Translate>
                          </Button>
                        )}
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            onPageChange={handleChangePage}
            component="div"
            count={props.totalItems}
            rowsPerPage={pagination.itemsPerPage}
            page={pagination.activePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  realms: storeState.internalRealms.realms,
  realm: storeState.internalRealms.realm,
  totalItems: storeState.internalRealms.totalItems,
  updating: storeState.internalRealms.updating,
  updateSuccess: storeState.internalRealms.updateSuccess,
});

const mapDispatchToProps = { getRealms, updateStatus, setRealm };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Realms);
