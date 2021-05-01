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
import {createEntity as createFeature, updateEntity as updateFeature} from "app/entities/feature/feature.reducer";
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
  const [editableFeature, setEditableFeature] = useState<IFeature>();
  const [datasource, setDatasource] = useState<IDatasources>();
  const [canceled, setCanceled] = useState<boolean>(false);

  useEffect(() => {
    setDatasource(props.location.state.datasource);
    setFeatureType(props.location.state.featureType);
    setEditableFeature(props.location.state.feature);
  }, []);

  useEffect(() => {
    props.getFunctions();
  }, []);

  useEffect(() => {
    if (editableFeature) {
      setSelectedFunction(props.functions.find(func => editableFeature.functionId === func.id));
    }
  }, [props.functions]);

  useEffect(() => {
    if (editableFeature) {
      setFeatureType(editableFeature.featureType);
      setNameText(editableFeature.name);
      setTypeText(editableFeature.type);
      setDefinitionText(editableFeature.definition);
    }
  }, [editableFeature]);

  const onCancelClick = () => {
    setCanceled(true);
  };

  const onUpdateFeature = () => {
    editableFeature.definition = definitionText;
    editableFeature.functionId = selectedFunction?.id;
    editableFeature.name = nameText;
    editableFeature.type = typeText;
    props.updateFeature(editableFeature);
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
    if (editableFeature) {
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

  if (props.succeeded || canceled) {
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
          { editableFeature ?
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
            {editableFeature ?
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
  succeeded: storeState.feature.updateSuccess,
});
const mapDispatchToProps = { getFunctions, createFeature, updateFeature };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FeaturesCreateModal);

