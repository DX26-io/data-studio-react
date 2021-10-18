import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getEntities, setVisualizationColor, deleteEntity } from './visualizationcolors.reducer';
import { IVisualizationcolors } from 'app/shared/model/visualizationcolors.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { DialogContainer, Flex, Button, ActionButton } from '@adobe/react-spectrum';
import { colors, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Edit from '@spectrum-icons/workflow/Edit';
import VisualizationcolorsUpdate from './visualizationcolors-update';
import VisualizationcolorsDelete from './visualizationcolors-delete'
import Delete from '@spectrum-icons/workflow/Delete';


export interface IVisualizationcolorsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> { }

export const Visualizationcolors = (props: IVisualizationcolorsProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isdeleteAlertDialogOpen, setDeleteAlertDialogOpen] = React.useState(false);
  const [colorCode, setColorCode] = React.useState<IVisualizationcolors>();
  useEffect(() => {
    props.getEntities();
  }, []);

  return (
    <><SecondaryHeader
      breadcrumbItems={[
        { label: 'Home', route: '/' },
        { label: 'Visualization colors', route: '/administration/visualization-colors' },
      ]}
      title={translate('visualizationcolors.home.title')}
    >
      <Button
        variant="cta"
        onPress={() => {
          setVisualizationColor({})
          setOpen(true);
        }}
        data-testid="create-color"
      >
        <Translate contentKey="entity.action.create">Create</Translate>
      </Button>
    </SecondaryHeader>
      <DialogContainer onDismiss={() => setOpen(false)}>
        {isOpen && <VisualizationcolorsUpdate visualizationColors={colorCode} />}
      </DialogContainer>
      <DialogContainer onDismiss={() => setDeleteAlertDialogOpen(false)}>
        {isdeleteAlertDialogOpen && <VisualizationcolorsDelete id={colorCode.id} />}
      </DialogContainer>

      <div className="dx26-container">
        <Paper className="dx26-table-pager">
          <TableContainer style={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Translate contentKey="visualizationcolors.field.id">ID</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="visualizationcolors.field.code">Code</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="visualizationcolors.field.color">Color</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="entity.action.manage">Manage</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.visualizationColorsList.map((visualizationColor, i) => (
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
                            setColorCode(visualizationColor)
                            setOpen(true);
                          }}
                        >
                          <Edit size="S" />
                        </a>
                        <a
                          onClick={() => {
                            setColorCode(visualizationColor)
                            setDeleteAlertDialogOpen(true)
                          }}
                        >
                            <Delete color="negative" size="S"/>
                          
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

const mapStateToProps = ({ visualizationColors }: any) => ({
  visualizationColorsList: visualizationColors.entities,
  loading: visualizationColors.loading,
});

const mapDispatchToProps = {
  getEntities,
  deleteEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Visualizationcolors);