import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Translate, getSortState, translate } from 'react-jhipster';
import { ITEMS_PER_PAGE_OPTIONS, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getOrganisations, searchOrganisations, setOrganisation,updateStatus } from './organisation.reducer';
import { IRootState } from 'app/shared/reducers';
import { Button, Flex, DialogContainer, SearchField, View } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { getSession } from 'app/shared/reducers/authentication';
import ConfirmationDialog from 'app/shared/components/confirmation-dialog';

export interface IOrganisationsProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Organisations = (props: IOrganisationsProps) => {
  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  const [isOpen, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const fetchUsersOrganisations = () => {
    props.getOrganisations(pagination.activePage, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    fetchUsersOrganisations();
  }, [pagination.activePage, pagination.order, pagination.sort, pagination.itemsPerPage]);

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
      });
    }
  }, [props.location.search]);

  const setUpdateSuccess = () => {
    fetchUsersOrganisations();
    props.getSession();
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

  const { organisations, match, totalItems } = props;

  const onToggleStatus = organisation => {
    setOpen(true);
    props.setOrganisation(organisation);
  };

  const onClickRealms = organisationId => {
    const url = window.location.origin + `/internal-realm-management?organisationId=${organisationId}&page=0&sort=id,asc`;
    window.open(url, '_blank');
  };

  const _updateStatus = (isActive,id)=>{
    props.updateStatus(isActive,id);
  };

  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: translate('organisations.title'), route: '/administration/organisation-management' },
        ]}
        title={translate('organisations.title')}
      ></SecondaryHeader>
      <View margin="size-150">
        <SearchField
          value={searchValue}
          onChange={event => {
            setSearchValue(event);
            props.searchOrganisations(event, pagination.activePage, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);
          }}
          placeholder={translate('organisations.search')}
        />
      </View>
      <DialogContainer
        onDismiss={() => {
          setOpen(false);
        }}
      >
        {isOpen && (
          <ConfirmationDialog
            updateSuccess={props.updateSuccess}
            entity={props.organisation}
            updateStatus={_updateStatus}
            setOpen={setOpen}
            setUpdateSuccess={setUpdateSuccess}
            updateContentKey="organisations.update"
            titleContentKey="organisations.title"
            confirmMessageContentKey="organisations.confirmMessage"
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
                    <Translate contentKey="organisations.name">Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="organisations.status">Status</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="organisations.createdBy">Created By</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {organisations.map((organisation, i) => (
                  <TableRow key={`organisation-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      {organisation.id}
                    </TableCell>
                    <TableCell align="center">{organisation.name}</TableCell>
                    <TableCell align="center">
                      {organisation.isActive ? (
                        <Translate contentKey="organisations.enabled">Enabled</Translate>
                      ) : (
                        <Translate contentKey="organisations.disabled">Disabled</Translate>
                      )}
                    </TableCell>
                    <TableCell align="center">{organisation.createdBy}</TableCell>
                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center" alignItems="center">
                        {organisation.isActive ? (
                          <Button variant="cta" type="submit" onPress={() => onToggleStatus(organisation)}>
                            <Translate contentKey="organisations.deactivate">Deactivate</Translate>
                          </Button>
                        ) : (
                          <Button variant="primary" type="submit" onPress={() => onToggleStatus(organisation)}>
                            <Translate contentKey="organisations.activate">Activate</Translate>
                          </Button>
                        )}
                        <Button variant="cta" type="submit" onPress={() => onClickRealms(organisation.id)}>
                          <Translate contentKey="realms.title">Realms</Translate>
                        </Button>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            component="div"
            count={totalItems}
            rowsPerPage={pagination.itemsPerPage}
            page={pagination.activePage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  organisations: storeState.organisations.organisations,
  organisation: storeState.organisations.organisation,
  totalItems: storeState.organisations.totalItems,
  updating: storeState.organisations.updating,
  account: storeState.authentication.account,
  updateSuccess: storeState.organisations.updateSuccess,
});

const mapDispatchToProps = { getOrganisations, getSession, searchOrganisations, setOrganisation,updateStatus };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Organisations);
