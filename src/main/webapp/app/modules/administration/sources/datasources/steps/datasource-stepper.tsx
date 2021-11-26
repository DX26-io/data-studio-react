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
import { resetConnection } from '../../connections/connection.reducer';
import { getSteps, isNextDisabled } from './datasource-util';
import { resetSteps, setIsAddFeaturesCalled } from './datasource-steps.reducer';
import { reset, createDatasource, updateDatasource, addFeatures, createDatasourceWithAction } from '../datasources.reducer';
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
    datasourceUpdateSuccess,
    datasourceUpdateError,
    createdDatasource,
    updateFeaturesSuccess,
    datasource,
    exploreModelTabId,
    connection,
    updatedFeatures,
    features,
  } = props;
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const dialog = useDialogContainer();

  const getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return <ExploreDataModel />;
      case 1:
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
  };

  const create = () => {
    if (datasource.id) {
      props.createDatasourceWithAction({ ...datasource, connectionName: connection.linkId, id: null }, 'EDIT');
    } else {
      props.createDatasource({ ...datasource, connectionName: connection.linkId });
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      create();
    }
    if (activeStep === 1) {
      const _features = updatedFeatures && updatedFeatures.length > 0 ? updatedFeatures : features;
      props.addFeatures({
        datasourceId: createdDatasource.id,
        featureList: _features,
      });
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    if (datasourceUpdateSuccess && datasourceUpdateError === null) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  }, [datasourceUpdateSuccess]);

  useEffect(() => {
    if (updateFeaturesSuccess) {
      handleClose();
      setUpdateSuccess();
    }
  }, [updateFeaturesSuccess]);

  return (
    <Dialog data-testid="datasource-stepper-dialog" width="80vw" size="L" minHeight="90vh">
      <Heading>
        <Flex alignItems="center" gap="size-100">
          {datasource.id ? (
            <Translate contentKey="datasources.home.update">Update Datasource</Translate>
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
          <Button variant="cta" isDisabled={isNextDisabled(datasource, exploreModelTabId, activeStep)} onPress={handleNext}>
            {activeStep === 0
              ? translate('entity.action.save')
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
              </div>
            )}
          </div>
        </div>
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  connection: storeState.datasourceSteps.connection,
  createdDatasource: storeState.datasources.entity,
  datasourceUpdateSuccess: storeState.datasources.updateSuccess,
  datasourceUpdateError: storeState.datasources.updateError,
  updatedFeatures: storeState.datasourceSteps.features,
  features: storeState.connections.features,
  updateFeaturesSuccess: storeState.datasources.updateFeaturesSuccess,
  datasource: storeState.datasourceSteps.datasource,
  exploreModelTabId: storeState.datasourceSteps.exploreModelTabId,
});

const mapDispatchToProps = {
  reset,
  resetSteps,
  createDatasource,
  resetConnection,
  setIsAddFeaturesCalled,
  updateDatasource,
  addFeatures,
  createDatasourceWithAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DatasourceStepper);
