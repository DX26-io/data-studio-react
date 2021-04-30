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
import {RouteComponentProps} from 'react-router-dom';
import {connect} from 'react-redux';
import {IRootState} from 'app/shared/reducers';
import {getEntities} from "app/entities/functions/function.reducer";

interface IFeaturesCreateModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string, featureId: string, viewId: string }> {}

const FeaturesCreateModal = (props: IFeaturesCreateModalProps) => {
  const [featureType, setFeatureType] = useState('');

  useEffect(() => {
    setFeatureType(props.location.state.featureType);
  }, []);


  useEffect(() => {
    props.getEntities();
  }, []);

  const onCancelClick = () => {
    props.history.push('/dashboards/' + props.match.params.id + '/' + props.match.params.viewId + '/build');
  };

  const onCreateClick = () => {
  };

  const functionFilter = (func) => {
    if (featureType === 'DIMENSION') {
      return func.dimensionUse;
    }
    if (featureType === 'MEASURE') {
      return func.measureUse;
    }
    return false;
  };

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
                           placeholder="customer_attrition"/>
                <TextField label={translate('datastudioApp.feature.dialogs.create.type')}
                           placeholder="varchar(30)"/>
                <TextArea label={translate('datastudioApp.feature.dialogs.create.definition')}
                          placeholder="yearquarter(order_date)"/>
              </Form>
            </View>
            <View width="100%">
              <ListBox
                aria-label={translate('datastudioApp.feature.dialogs.create.searchfunction')}
                selectionMode="none"
                items={props.functions.filter(functionFilter)}>
                {(feature) => <Item>{feature.name}</Item>}
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
});

const mapDispatchToProps = { getEntities };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FeaturesCreateModal);

