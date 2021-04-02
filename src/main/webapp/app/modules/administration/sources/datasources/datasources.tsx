import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getDatasources } from './datasources.reducer';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

import { Translate, getSortState, translate } from 'react-jhipster';
import { ITEMS_PER_PAGE_OPTIONS, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

import { IRootState } from 'app/shared/reducers';
import { Button, Flex, DialogContainer } from '@adobe/react-spectrum';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import Edit from '@spectrum-icons/workflow/Edit';
import DatasourceStepper from './steps/datasource-stepper';

export interface IDatasourcesProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Datasources = (props: IDatasourcesProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isNew, setNew] = React.useState(false);

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const getAllEntities = () => {
    props.getDatasources(pagination.activePage - 1, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [pagination.activePage, pagination.order, pagination.sort]);

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

  const sort = p => () => {
    setPagination({
      ...pagination,
      order: pagination.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
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

  const setUpdateSuccess = () => {
    getAllEntities();
  };

  const { datasources, loading, totalItems } = props;
  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'Sources', route: '/administration/sources' },
          { label: 'Datasources', route: '/administration/sources/datasources' },
        ]}
        title={translate('datasources.home.title')}
      >
        <Button
          variant="cta"
          onPress={() => {
            setOpen(true);
            setNew(true);
          }}
          data-testid="create-group"
        >
          <Translate contentKey="entity.action.create">Create</Translate>
        </Button>
      </SecondaryHeader>
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && <DatasourceStepper setUpdateSuccess={setUpdateSuccess} setOpen={setOpen} isNew={true} {...props}></DatasourceStepper>}
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
                    <Translate contentKey="datasources.name">Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="datasources.connectionName">Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datasources.map((datasource, i) => (
                  <TableRow key={`datasource-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      {datasource.id}
                    </TableCell>
                    <TableCell align="center">{datasource.name}</TableCell>
                    <TableCell align="center">{datasource.connectionName}</TableCell>
                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center">
                        <a
                        // onClick={() => {
                        // }}
                        >
                          <Edit size="S" />
                        </a>
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* TODO : api pagination is not implemented so commenting the below code for time being */}
          {/* <TablePagination
            rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            component="div"
            count={totalItems}
            rowsPerPage={pagination.itemsPerPage}
            page={pagination.activePage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          /> */}
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  datasources: storeState.datasources.datasources,
  loading: storeState.datasources.loading,
  totalItems: storeState.datasources.totalItems,
});

const mapDispatchToProps = {
  getDatasources,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Datasources);
