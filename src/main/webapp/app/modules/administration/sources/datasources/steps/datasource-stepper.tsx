import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import { translate, Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { View, Flex, Dialog, Heading, Divider, Content, Button, Header, useDialogContainer } from '@adobe/react-spectrum';
import { getConnectionsTypes, resetConnection } from '../../connections/connection.reducer';
import ConnectionsTypes from './connections-types/connections-types';
import DataConnection from './data-connection/data-connection';
import { getSteps, isNextDisabled } from './datasource-util';
import { resetSteps, setIsAddFeaturesCalled, setIsSaveConnectionCalled } from './datasource-steps.reducer';
import { reset, createDatasource } from '../datasources.reducer';
import CacheProperty from './cache-property';
import ExploreDataModel from './explore-data-model/explore-data-model';
import DimensionMeasures from './dimensions-measures';

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
    setUpdateSuccess,
    setOpen,
    isNew,
    connectionsTypes,
    connectionType,
    connection,
    isConnected,
    datasourceUpdateSuccess,
    datasourceUpdateError,
    createdDatasource,
    updateFeaturesSuccess,
    datasource,
    exploreModelTabId,
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
      case 4:
        return <DimensionMeasures datasourceId={createdDatasource.id} />;
      default:
        return 'wrong step selected';
    }
  };

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    props.resetSteps();
    props.reset();
    props.resetConnection();
  };

  const handleNext = () => {
    if (activeStep === 3) {
      props.setIsSaveConnectionCalled(true);
    }
    if (activeStep === 4) {
      props.setIsAddFeaturesCalled(true);
    }
    if (activeStep === 0 || activeStep === 1 || activeStep === 2) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
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

  useEffect(() => {
    if (datasourceUpdateSuccess && datasourceUpdateError === null) {
      setIsSaveConnectionCalled(false);
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  }, [datasourceUpdateSuccess]);

  useEffect(() => {
    if (updateFeaturesSuccess) {
      handleClose();
      setUpdateSuccess();
      setIsAddFeaturesCalled(false);
    }
  }, [updateFeaturesSuccess]);

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
          <Button variant="secondary" isDisabled={activeStep === 0 || activeStep === 4} onPress={handleBack}>
            <Translate contentKey="entity.action.back">Back</Translate>
          </Button>
          <Button
            variant="cta"
            isDisabled={isNextDisabled(connection, connectionType, datasource, isConnected, exploreModelTabId, activeStep)}
            onPress={handleNext}
          >
            {activeStep === 3
              ? translate('datasources.home.create')
              : activeStep === steps.length - 1
              ? translate('entity.action.finish')
              : translate('entity.action.next')}
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
                  <Button variant="secondary" isDisabled={activeStep === 0 || activeStep === 4} onPress={handleBack}>
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </Button>
                  <Button
                    variant="cta"
                    isDisabled={isNextDisabled(connection, connectionType, datasource, isConnected, exploreModelTabId, activeStep)}
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
  createdDatasource: storeState.datasources.entity,
  datasourceUpdateSuccess: storeState.datasources.updateSuccess,
  isConnectionSelected: storeState.datasourceSteps.isConnectionSelected,
  datasourceUpdateError: storeState.datasources.updateError,
  features: storeState.datasourceSteps.features,
  updateFeaturesSuccess: storeState.connections.updateFeaturesSuccess,
  datasource: storeState.datasourceSteps.datasource,
  exploreModelTabId: storeState.datasourceSteps.exploreModelTabId,
});

const mapDispatchToProps = {
  getConnectionsTypes,
  reset,
  resetSteps,
  createDatasource,
  resetConnection,
  setIsAddFeaturesCalled,
  setIsSaveConnectionCalled,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourceStepper);
