import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, translate, getSortState } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { getEntitiesWithPages, deleteEntity,getEntity } from './visualisation-colors.reducer';
import { IVisualisationColors } from 'app/shared/model/visualization-colors.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { DialogContainer, Flex, Button, ActionButton } from '@adobe/react-spectrum';
import { colors, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@material-ui/core';
import Edit from '@spectrum-icons/workflow/Edit';
import VisualizationColorsUpdate from './visualisation-colors-update';
import { ITEMS_PER_PAGE_OPTIONS, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface IVisualisationColorsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> { }

export const Visualizationcolors = (props: IVisualisationColorsProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const getEntities = () => {
    props.getEntitiesWithPages(pagination.activePage, pagination.itemsPerPage);
    const endURL = `?page=${pagination.activePage}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    getEntities();
  }, [pagination.activePage, pagination.itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    if (page) {
      setPagination({
        ...pagination,
        activePage: +page,
      });
    }
  }, [props.location.search]);

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

  return (
    <><SecondaryHeader
      breadcrumbItems={[
        { label: 'Home', route: '/' },
        { label: translate('visualisationColors.home.title'), route: '/administration/visualization-colors' },
      ]}
      title={translate('visualisationColors.home.title')}
    >
      <Button
        variant="cta"
        onPress={() => {
          setOpen(true);
        }}
        data-testid="create-color"
      >
        <Translate contentKey="entity.action.create">Create</Translate>
      </Button>
    </SecondaryHeader>
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && <VisualizationColorsUpdate setOpen={setOpen}/>}
      </DialogContainer>

      <div className="dx26-container">
        <Paper className="dx26-table-pager">
          <TableContainer style={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Translate contentKey="visualisationColors.field.id">ID</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="visualisationColors.field.code">Code</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="visualisationColors.field.color">Color</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.entities.map((visualizationColor, i) => (
                  <TableRow key={`datasource-${i}`}>
                    <TableCell component="th" scope="row" align="center">
                      {visualizationColor.id}
                    </TableCell>
                    <TableCell align="center">{visualizationColor.code}</TableCell>
                    <TableCell align="center">
                      <div style={{ backgroundColor: visualizationColor.code,height: '25px',width: '25px',margin: 'auto'}}>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <Flex gap="size-100" justifyContent="center">
                        <a
                          onClick={() => {
                            setOpen(true);
                            props.getEntity(visualizationColor.id);
                          }}
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
          <TablePagination
            rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            component="div"
            count={props.totalItems}
            rowsPerPage={pagination.itemsPerPage}
            page={pagination.activePage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />

        </Paper>
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  entities: storeState.visulisationColors.entities,
  loading: storeState.visulisationColors.loading,
  totalItems: storeState.visulisationColors.totalItems,
});

const mapDispatchToProps = {
  getEntitiesWithPages,
  deleteEntity,
  getEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Visualizationcolors);
