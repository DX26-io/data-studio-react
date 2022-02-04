import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { getEntities, setVisualizationColor, deleteEntity,getEntity } from './visualisation-colors.reducer';
import { IVisualisationColors } from 'app/shared/model/visualization-colors.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { DialogContainer, Flex, Button, ActionButton } from '@adobe/react-spectrum';
import { colors, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Edit from '@spectrum-icons/workflow/Edit';
import VisualizationColorsUpdate from './visualisation-colors-update';


export interface IVisualisationColorsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> { }

export const Visualizationcolors = (props: IVisualisationColorsProps) => {
  const [isOpen, setOpen] = React.useState(false);
  useEffect(() => {
    props.getEntities();
  }, []);

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
                {props.visualisationColors.map((visualizationColor, i) => (
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


        </Paper>
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualisationColors: storeState.visulisationColors.entities,
  loading: storeState.visulisationColors.loading,
});

const mapDispatchToProps = {
  getEntities,
  deleteEntity,
  getEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Visualizationcolors);
