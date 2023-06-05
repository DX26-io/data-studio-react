import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
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
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: useTheme().spacing(1),
  },
  instructions: {
    marginTop: useTheme().spacing(1),
    marginBottom: useTheme().spacing(1),
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
    props.resetSteps();
    props.resetConnection();
    dialog.dismiss();
    setConnectionStepperOpen(false);
    setUpdateSuccess();
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
  connectionType: storeState.connectionSteps.connectionType,
  connection: storeState.connections.connection,
  isConnected: storeState.datasources.isConnected,
  isConnectionSelected: storeState.connections.isConnectionSelected,
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
