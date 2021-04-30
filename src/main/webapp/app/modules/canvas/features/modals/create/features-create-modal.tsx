import React, {ReactText, useEffect, useState} from 'react';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider, Flex, Form, Grid,
  Heading, Item, ListBox, Text, TextArea,
  TextField, View,
} from '@adobe/react-spectrum';
import {translate, Translate} from 'react-jhipster';
import {Redirect, RouteComponentProps} from 'react-router-dom';
import {connect} from 'react-redux';
import {IRootState} from 'app/shared/reducers';
import {getEntities as getFunctions} from "app/entities/functions/function.reducer";
import {createEntity as createFeature, getEntity as getFeature} from "app/entities/feature/feature.reducer";
import {IFunction} from "app/shared/model/function.model";
import {IDatasources} from "app/shared/model/datasources.model";

interface IFeaturesCreateModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string, featureId: string, viewId: string }> {}

const FeaturesCreateModal = (props: IFeaturesCreateModalProps) => {
  const [featureType, setFeatureType] = useState('');
  const [nameText, setNameText] = useState('');
  const [typeText, setTypeText] = useState('');
  const [definitionText, setDefinitionText] = useState('');
  const [selectedFunction, setSelectedFunction] = useState<IFunction>();
  const [datasource, setDatasource] = useState<IDatasources>();
  const [canceled, setCanceled] = useState<boolean>(false);

  useEffect(() => {
    setDatasource(props.location.state.datasource);
    setFeatureType(props.location.state.featureType);
    if (props.match.params.featureId) {
      props.getFeature(props.match.params.featureId);
    }
  }, []);

  useEffect(() => {
    props.getFunctions();
  }, []);

  useEffect(() => {
    setFeatureType(props.feature.featureType);
    setNameText(props.feature.name);
    setTypeText(props.feature.type);
    setDefinitionText(props.feature.definition);
  }, [props.feature]);

  const onCancelClick = () => {
    setCanceled(true);
  };

  const onCreateClick = () => {
    props.createFeature({
      datasource,
      definition: definitionText,
      featureType,
      functionId: selectedFunction.id,
      name: nameText,
      type: typeText,
    })
  };

  const onFunctionSelected = (selectedSet) => {
    const f = props.functions.find((func) => selectedSet.has(func.id));
    setDefinitionText(f.value);
    setSelectedFunction(f);
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
          <Translate contentKey="datastudioApp.feature.dialogs.create.title">_Delete Feature</Translate>
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
                  onPress={onCreateClick}>
            <Translate contentKey="entity.action.create">_Create</Translate>
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
const mapDispatchToProps = { getFunctions, createFeature, getFeature };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FeaturesCreateModal);

