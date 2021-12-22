import React, { useState, useEffect } from 'react';
import { Button, View, Flex } from '@adobe/react-spectrum';
import uuid from 'react-uuid';
import './visualisation-data-constraints.scss';
import { updateConditionExpression, updateEntity } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import Condition from './condition';

const DataConstraints = props => {
  // const [remountComponent, setRemountComponent] = useState(true);

  const addStartingCondition = () => {
    const conditionExpression = {
      uuid: uuid(),
      '@type': 'Compare',
      comparatorType: 'EQ',
      valueType: {
        '@type': 'valueType',
        value: '',
        type: '',
      },
      valueTypes: [],
    };
    props.updateConditionExpression(conditionExpression);
  };

  useEffect(() => {
    if (props.visualMetaData.conditionExpression) {
      props.updateConditionExpression(props.visualMetaData.conditionExpression);
    }
  }, []);

  const save = () => {
    props.updateEntity({
      viewId: parseInt(props.view.id, 10),
      visualMetadata: { ...props.visualMetaData, conditionExpression: props.conditionExpression },
    });
  };

  const clear = () => {
    props.updateConditionExpression(null);
  };

  return (
    <>
      <View minHeight={'50vh'}>
        {props.conditionExpression === null && (
          <Button
            variant="cta"
            onPress={() => {
              addStartingCondition();
            }}
          >
            <Translate contentKey="dataConstraints.add"> Add Condition</Translate>
          </Button>
        )}
        {props.conditionExpression && (
          <React.Fragment>
            <Condition key={props.conditionExpression.uuid} condition={props.conditionExpression} />
            <Flex direction="row" justifyContent="end" alignItems="end" gap="size-100" marginTop="size-100">
              <Button variant="cta" onPress={clear}>
                <Translate contentKey="entity.action.cancel">Cancel</Translate>
              </Button>
              <Button variant="cta" onPress={save} isDisabled={props.updating}>
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </Flex>
          </React.Fragment>
        )}
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  conditionExpression: storeState.visualmetadata.conditionExpression,
  visualMetaData: storeState.visualmetadata.entity,
  updating: storeState.visualmetadata.updating,
  view: storeState.views.entity,
});
const mapDispatchToProps = {
  updateConditionExpression,
  updateEntity,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataConstraints);
