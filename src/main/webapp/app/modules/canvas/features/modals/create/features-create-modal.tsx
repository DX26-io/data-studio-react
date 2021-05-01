import React, {useEffect, useState} from 'react';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
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
} from '@adobe/react-spectrum';
import {translate, Translate} from 'react-jhipster';
import {Redirect, RouteComponentProps} from 'react-router-dom';
import {connect} from 'react-redux';
import {IRootState} from 'app/shared/reducers';
import {getEntities as getFunctions} from "app/entities/functions/function.reducer";
import {createEntity as createFeature, updateEntity as updateFeature, reset} from "app/entities/feature/feature.reducer";
import {IFunction} from "app/shared/model/function.model";
import {IDatasources} from "app/shared/model/datasources.model";
import {IFeature} from "app/shared/model/feature.model";

interface IFeaturesCreateModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string, featureId: string, viewId: string }> {}

const FeaturesCreateModal = (props: IFeaturesCreateModalProps) => {
  const [featureType, setFeatureType] = useState('');
  const [nameText, setNameText] = useState('');
  const [typeText, setTypeText] = useState('');
  const [definitionText, setDefinitionText] = useState('');
  const [selectedFunction, setSelectedFunction] = useState<IFunction>();
  const [datasource, setDatasource] = useState<IDatasources>();
  const [canCloseDialog, setCanCloseDialog] = useState<boolean>(false);

  useEffect(() => {
    setDatasource(props.location.state.datasource);
    setFeatureType(props.location.state.featureType);
  }, []);

  useEffect(() => {
    props.getFunctions();
  }, []);

  useEffect(() => {
    setSelectedFunction(props.functions.find(func => props.selectedFeature?.functionId === func.id));
  }, [props.functions, props.selectedFeature]);

  useEffect(() => {
    setFeatureType(props.selectedFeature?.featureType);
    setNameText(props.selectedFeature?.name);
    setTypeText(props.selectedFeature?.type);
    setDefinitionText(props.selectedFeature?.definition);
  }, [props.selectedFeature]);

  useEffect(() => {
    setCanCloseDialog(props.updateSuccess);
  }, [props.updateSuccess]);

  const onCancelClick = () => {
    props.reset();
    setCanCloseDialog(true);
  };

  const onUpdateFeature = () => {
    const ft: IFeature = {
      ...props.selectedFeature,
      definition: definitionText,
      functionId: selectedFunction?.id,
      name: nameText,
      type: typeText,
    }
    props.updateFeature(ft);
  };

  const onCreateFeature = () => {
    const newFeature:IFeature = {
      datasource,
      definition: definitionText,
      featureType,
      functionId: selectedFunction?.id,
      name: nameText,
      type: typeText,
    };
    props.createFeature(newFeature);
  };

  const onSubmitClick = () => {
    if (props.selectedFeature) {
      onUpdateFeature();
    } else {
      onCreateFeature();
    }
  };

  const onFunctionSelected = (selectedSet) => {
    const selectedFunc = props.functions.find((func) => selectedSet.has(func.id));
    setDefinitionText(selectedFunc.value);
    setSelectedFunction(selectedFunc);
  }

  const functionFilter = (func) => {
    if (featureType === 'DIMENSION') {
      return func.dimensionUse;
    }
    if (featureType === 'MEASURE') {
      return func.measureUse;
    }
    return false;
  };

  if (canCloseDialog) {
    return (
      <Redirect
        to={{
          pathname: '/dashboards/' + props.match.params.id + '/' + props.match.params.viewId + '/build',
        }}
      />
    );
  }

  return (
    <DialogContainer onDismiss={onCancelClick}>
      <Dialog>
        <Heading>
          { props.selectedFeature ?
            <Translate contentKey="datastudioApp.feature.dialogs.create.edittitle">_Edit Feature</Translate>
            :
            <Translate contentKey="datastudioApp.feature.dialogs.create.createtitle">_Create Feature</Translate>
          }
        </Heading>
        <Divider/>
        <Content>
          <Flex
            width="100%"
            direction="row"
            gap="size-100">
            <View width="100%">
              <Form isRequired
                    necessityIndicator="icon">
                <TextField label={translate('datastudioApp.feature.dialogs.create.name')}
                           placeholder="customer_attrition"
                           value={nameText}
                           onChange={setNameText}/>
                <TextField label={translate('datastudioApp.feature.dialogs.create.type')}
                           placeholder="varchar(30)"
                           value={typeText}
                           onChange={setTypeText}/>
                <TextArea label={translate('datastudioApp.feature.dialogs.create.definition')}
                          placeholder="yearquarter(order_date)"
                          value={definitionText}
                          onChange={setDefinitionText}/>
              </Form>
            </View>
            <View width="100%">
              <ListBox
                aria-label={translate('datastudioApp.feature.dialogs.create.functions')}
                selectionMode="single"
                onSelectionChange={onFunctionSelected}
                items={props.functions.filter(functionFilter)}>
                {(func) => (
                    <Item textValue={func.name}>
                      <Text>{func.name}</Text>
                      <Text slot="description">{func.description}</Text>
                    </Item>)}
              </ListBox>
            </View>
          </Flex>
        </Content>
        <ButtonGroup>
          <Button variant="secondary"
                  isQuiet
                  onPress={onCancelClick}>
            <Translate contentKey="entity.action.cancel">_Cancel</Translate>
          </Button>
          <Button variant="primary"
                  onPress={onSubmitClick}>
            { props.selectedFeature ?
              <Translate contentKey="entity.action.update">_Edit</Translate>
              :
              <Translate contentKey="entity.action.create">_Create</Translate>
            }
          </Button>
        </ButtonGroup>
      </Dialog>
    </DialogContainer>
  );
};


const mapStateToProps = (storeState: IRootState) => ({
  functions: storeState.functions.entities,
  feature: storeState.feature.entity,
  selectedFeature: storeState.feature.selectedFeature,
  updateSuccess: storeState.feature.updateSuccess,
});
const mapDispatchToProps = { getFunctions, createFeature, updateFeature, reset };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FeaturesCreateModal);
