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
import { getConnectionsTypes, resetConnection, createConnection, updateConnection, deleteConnection } from './connection.reducer';
import ConnectionsTypes from './connections-types/connections-types';
import DataConnection from './data-connection/data-connection';
import { getSteps, isNextDisabled, prepareConnection } from './connections.util';
import { resetSteps, setIsSaveConnectionCalled } from './connection-steps.reducer';
import CacheProperty from './cache-property';

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

export interface IConnectionStepperProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  setConnectionStepperOpen: (isConnectionStepperOpen: boolean) => void;
  history: any;
}

const ConnectionStepper = (props: IConnectionStepperProps) => {
  const {
    setUpdateSuccess,
    setConnectionStepperOpen,
    connectionsTypes,
    connectionType,
    connection,
    isConnected,
    isConnectionSelected,
    connectionUpdateSuccess,
    connectionUpdateError,
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
      default:
        return 'wrong step selected';
    }
  };

  const handleClose = () => {
    setConnectionStepperOpen(false);
    dialog.dismiss();
    props.resetSteps();
    props.resetConnection();
  };

  const saveConnection = () => {
    const conn = prepareConnection(connection, connectionType);
    if (!isConnectionSelected) {
      props.createConnection(conn);
    } else {
      props.updateConnection(conn);
    }
  };

  const handleNext = () => {
    if (activeStep === 2) {
      saveConnection();
    }
    if (activeStep === 0 || activeStep === 1) {
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

  const rollbackConnection = () => {
    if (!isConnectionSelected) {
      props.deleteConnection(connection.id);
    }
  };

  useEffect(() => {
    if (connectionUpdateError && !connectionUpdateSuccess) {
      rollbackConnection();
    }
  }, [connectionUpdateError]);

  useEffect(() => {
    if (connectionUpdateSuccess) {
      setUpdateSuccess();
      handleClose();
    }
  }, [connectionUpdateSuccess]);

  return (
    <Dialog data-testid="datasource-stepper-dialog" width="80vw" size="L" minHeight="90vh">
      <Heading>
        <Flex alignItems="center" gap="size-100">
          <Translate contentKey="connections.home.create">Create Connection</Translate>
        </Flex>
      </Heading>
      <Header>
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="connection-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="secondary" isDisabled={activeStep === 0} onPress={handleBack}>
            <Translate contentKey="entity.action.back">Back</Translate>
          </Button>
          <Button variant="cta" isDisabled={isNextDisabled(connection, connectionType, isConnected, activeStep)} onPress={handleNext}>
            {activeStep === 2
              ? translate('connections.home.create')
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
                  <Button variant="secondary" isDisabled={activeStep === 0 } onPress={handleBack}>
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </Button>
                  <Button
                    variant="cta"
                    isDisabled={isNextDisabled(connection, connectionType, isConnected, activeStep)}
                    onPress={handleNext}
                  >
                    {activeStep === 2
                      ? translate('connections.home.create')
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
  isConnectionSelected: storeState.datasourceSteps.isConnectionSelected,
  connectionUpdateError: storeState.connections.updateError,
  connectionUpdateSuccess: storeState.connections.updateSuccess,
});

const mapDispatchToProps = {
  getConnectionsTypes,
  resetSteps,
  resetConnection,
  setIsSaveConnectionCalled,
  createConnection,
  updateConnection,
  deleteConnection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionStepper);
