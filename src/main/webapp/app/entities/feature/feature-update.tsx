import React, { useEffect, useState } from 'react';
import {
  Button,
  Content,
  Dialog,
  Divider,
  Flex,
  Form,
  Heading,
  Item,
  ListBox,
  Text,
  TextArea,
  TextField,
  View,
  useDialogContainer,
  Header,
} from '@adobe/react-spectrum';
import { translate, Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getEntities as getFunctions } from 'app/entities/functions/function.reducer';
import {
  createEntity as createFeature,
  updateEntity as updateFeature,
  deleteEntity as deleteFeature,
  reset,
  getViewFeaturesEntities,
  setFeature,
} from 'app/entities/feature/feature.reducer';
import { defaultValue } from 'app/shared/model/error.model';
import Alert from '@spectrum-icons/workflow/Alert';
import { isFormValid } from './feature-util';

interface IFeatureUpdateProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
}

const FeatureUpdate = (props: IFeatureUpdateProps) => {
  const [error, setError] = useState(defaultValue);

  const dialog = useDialogContainer();

  useEffect(() => {
    props.getFunctions();
  }, []);

  const handleClose = () => {
    props.setOpen(false);
    dialog.dismiss();
    props.reset();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
      if(props && props.viewId){
        props.getViewFeaturesEntities(props.viewId);
      }
    }
  }, [props.updateSuccess]);

  const onUpdateFeature = () => {
    props.updateFeature(props.feature);
  };

  const onCreateFeature = () => {
    props.createFeature({
      ...props.feature,
      datasource: props.datasource,
    });
  };

  const save = () => {
    const errorObj = isFormValid(props.feature);
    setError(errorObj);
    if (errorObj.isValid) {
      if (props.feature && props.feature.id) {
        onUpdateFeature();
      } else {
        onCreateFeature();
      }
    }
  };

  const remove = () => {
    props.deleteFeature(props.feature.id);
  };

  const onFunctionSelected = selectedSet => {
    const selectedFunc = props.functions.find(func => selectedSet.has(func.id));
    props.setFeature({ ...props.feature, definition: selectedFunc.value, functionId: selectedFunc.id });
  };

  const functionFilter = func => {
    if (props.feature && props.feature.featureType === 'DIMENSION') {
      return func.dimensionUse;
    }
    if (props.feature && props.feature.featureType === 'MEASURE') {
      return func.measureUse;
    }
    return false;
  };

  return (
    <Dialog>
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="feature-form-heading">
          {props.feature && props.feature.id !== '' ? (
            <Translate contentKey="features.home.updateLabel">Update Feature</Translate>
          ) : (
            <Translate contentKey="features.home.createLabel">Create Feature</Translate>
          )}
        </Flex>
      </Heading>
      <Header data-testid="feature-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="feature-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button isDisabled={props.updating || !error.isValid} variant="cta" onPress={save} data-testid="feature-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Flex width="100%" direction="row" gap="size-100">
          <View width="100%">
            <Form isRequired necessityIndicator="icon">
              <TextField
                label={translate('features.name')}
                placeholder="customer_attrition"
                value={props.feature && props.feature.name ? props.feature.name : ''}
                onChange={event => {
                  props.setFeature({ ...props.feature, name: event });
                  const errorObj = isFormValid({ ...props.feature, name: event });
                  setError(errorObj);
                }}
              />
              <TextField
                label={translate('features.type')}
                placeholder="varchar(40)"
                value={props.feature && props.feature.type ? props.feature.type : ''}
                onChange={event => {
                  props.setFeature({ ...props.feature, type: event });
                  const errorObj = isFormValid({ ...props.feature, type: event });
                  setError(errorObj);
                }}
              />
              <TextArea
                label={translate('features.definition')}
                placeholder="yearquarter(order_date)"
                value={props.feature && props.feature.definition ? props.feature.definition : ''}
                onChange={event => {
                  props.setFeature({ ...props.feature, definition: event });
                  const errorObj = isFormValid({ ...props.feature, definition: event });
                  setError(errorObj);
                }}
              />
              {props.feature && props.feature.id !== '' ? (
                <React.Fragment>
                  <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                    <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
                  </span>
                  <Divider size="M" />{' '}
                </React.Fragment>
              ) : null}
            </Form>
            {props.feature && props.feature.id !== '' ? (
              <Button data-testid="delete" variant="negative" onPress={remove} marginTop="size-175" marginBottom="size-100">
                <Translate contentKey="entity.action.delete">Delete</Translate>
              </Button>
            ) : null}
            {!error.isValid && (
              <Flex gap="size-100" data-testid="validation-error" marginTop="static-size-200">
                <Alert color="negative" />
                <Text marginBottom="size-300">
                  <span className="spectrum-Body-emphasis error-message">
                    <Translate contentKey={error.translationKey}></Translate>
                  </span>
                </Text>
              </Flex>
            )}
          </View>
          <View width="100%">
            <ListBox
              aria-label={translate('features.functions')}
              selectionMode="single"
              onSelectionChange={onFunctionSelected}
              items={props.functions.filter(functionFilter)}
            >
              {func => (
                <Item textValue={func.name}>
                  <Text>{func.name}</Text>
                  <Text slot="description">{func.description}</Text>
                </Item>
              )}
            </ListBox>
          </View>
        </Flex>
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  functions: storeState.functions.entities,
  feature: storeState.feature.feature,
  updateSuccess: storeState.feature.updateSuccess,
  updating: storeState.feature.updating,
  viewId: storeState.views.entity.id,
  datasource: storeState.views.entity.viewDashboard.dashboardDatasource,
});
const mapDispatchToProps = { setFeature, getFunctions, createFeature, updateFeature, deleteFeature, reset, getViewFeaturesEntities };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FeatureUpdate);
