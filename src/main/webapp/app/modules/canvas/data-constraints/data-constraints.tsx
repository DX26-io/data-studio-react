import React from 'react';
import { Button, View } from '@adobe/react-spectrum';
import uuid from 'react-uuid';
import './visualisation-data-constraints.scss';
import { updateConditionExpression } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import Condition from './condition';

const DataConstraints = props => {
  
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
        {props.conditionExpression && <Condition condition={props.conditionExpression} />}
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  conditionExpression: storeState.visualmetadata.conditionExpression,
});
const mapDispatchToProps = {
  updateConditionExpression,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataConstraints);
