import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { translate, Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  View,
  Flex,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  Button,
  TextField,
  Header,
  Text,
  useDialogContainer,
} from '@adobe/react-spectrum';
import { getConnectionsTypes, createConnection, updateConnection, deleteConnection } from '../../connections/connections.reducer';
import ConnectionsTypes from './connections-types';
import DataConnection from './data-connection';
import { getSteps, isNextDisabled, prepareConnection } from './datasource-util';
import { resetSteps } from './datasource-steps.reducer';
import { reset, createEntity } from '../datasources.reducer';
import CacheProperty from './cache-property';
import ExploreDataModel from './explore-data-model';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export interface IDatasourceStepperProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
  history: any;
  isNew: boolean;
}

const DatasourceStepper = (props: IDatasourceStepperProps) => {
  const {
    isConnectionSelected,
    setUpdateSuccess,
    setOpen,
    isNew,
    connectionsTypes,
    connectionType,
    connection,
    isConnected,
    datasource,
    connectionUpdateSuccess,
    updateError,
    datasourceError,
  } = props;
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const dialog = useDialogContainer();

  const getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return <ConnectionsTypes connectionsTypes={connectionsTypes} />;
      case 1:
        return <DataConnection connectionType={connectionType} />;
      case 2:
        return <CacheProperty connection={connection} />;
      case 3:
        return <ExploreDataModel connection={connection} connectionType={connectionType} />;
      default:
        return 'Unknown stepIndex';
    }
  };

  const rollbackConnection = () => {
    if (!isConnectionSelected) {
      props.deleteConnection(connection.id);
    }
  };

  // const today = (): string => {
  //   // Today + 1 day - needed if the current day must be included
  //   const day: Date = new Date();
  //   day.setDate(day.getDate() + 1);
  //   const toDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  //   return toDate.toISOString().slice(0, 10);
  // };

  const createDatasource = () => {
    datasource['queryPath'] = '/api/queries';
    datasource['connectionName'] = connection.linkId;
    datasource['lastUpdated'] = new Date();
    props.createEntity(datasource);
  };

  const saveConnection = () => {
    const conn = prepareConnection(connection, connectionType);
    if (!isConnectionSelected) {
      props.createConnection(conn);
    } else {
      props.updateConnection(conn);
    }
    createDatasource();
  };

  const handleNext = () => {
    if (activeStep === 3) {
      saveConnection();
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    props.getConnectionsTypes();
  }, []);

  // useEffect(() => {
  //   if (connectionUpdateSuccess) {
  //     createDatasource();
  //   }
  //   // if (datasourceError) {
  //   //   rollbackConnection();
  //   // }
  // }, [connectionUpdateSuccess]);

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    props.resetSteps();
    props.reset();
  };

  const isDisabled = () => {
    // connectionType
  };

  const save = () => {};

  return (
    <Dialog data-testid="datasource-stepper-dialog" width="80vw" size="L" minHeight="90vh">
      <Heading>
        <Flex alignItems="center" gap="size-100">
          {!isNew ? (
            <Translate contentKey="datasources.home.edit">Edit Datasource</Translate>
          ) : (
            <Translate contentKey="datasources.home.create">Create Datasource</Translate>
          )}
        </Flex>
      </Heading>
      <Header>
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="group-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={save} data-testid="group-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <div className={classes.root}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>All steps completed</Typography>
                <Button variant="cta" onPress={handleReset}>
                  <Translate contentKey="entity.action.reset">Reset</Translate>
                </Button>
              </div>
            ) : (
              <div>
                <View marginTop="size-500" marginBottom="size-500">
                  {' '}
                  {getStepContent(activeStep)}
                </View>
                <Flex justifyContent="end" gap="size-100">
                  {updateError ? (
                    <React.Fragment>
                      <Text marginBottom="size-300">
                        <span className="spectrum-Body-emphasis">
                          <Translate contentKey="datasources.exploreDataModel.updateError">
                            The table from the same data source already exists.
                          </Translate>
                        </span>
                      </Text>
                    </React.Fragment>
                  ) : null}
                  <Button variant="secondary" isDisabled={activeStep === 0} onPress={handleBack}>
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </Button>
                  <Button
                    variant="cta"
                    isDisabled={isNextDisabled(connection, connectionType, isConnected, activeStep)}
                    onPress={handleNext}
                  >
                    {activeStep === 3
                      ? translate('datasources.home.create')
                      : activeStep === steps.length - 1
                      ? translate('entity.action.finish')
                      : translate('entity.action.next')}
                  </Button>
                </Flex>
              </div>
            )}
          </div>
        </div>
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  connectionsTypes: storeState.connections.connectionsTypes,
  connectionType: storeState.datasourceSteps.connectionType,
  connection: storeState.datasourceSteps.connection,
  isConnected: storeState.datasources.isConnected,
  updateError: storeState.datasources.updateError,
  datasourceError: storeState.datasources.errorMessage,
  datasource: storeState.datasourceSteps.datasource,
  isConnectionSelected: storeState.datasourceSteps.isConnectionSelected,
  connectionUpdateSuccess: storeState.connections.updateSuccess,
});

const mapDispatchToProps = {
  getConnectionsTypes,
  reset,
  resetSteps,
  deleteConnection,
  createEntity,
  createConnection,
  updateConnection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourceStepper);
