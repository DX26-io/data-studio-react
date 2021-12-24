import React, { useState, useEffect } from 'react';
import { Button, View, Flex } from '@adobe/react-spectrum';
import uuid from 'react-uuid';
import './visualisation-data-constraints.scss';
import { updateConditionExpression, updateEntity, validate } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import Condition from './condition';
import { VisualWrap } from '../visualisation/util/visualmetadata-wrapper';
import Alert from '@spectrum-icons/workflow/Alert';

const DataConstraints = props => {
  const [remountComponentKey, setRemountComponentKey] = useState(1);
  const [isSaveCalled, setIsSaveCalled] = useState(false);

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

  const save = () => {
    props.updateEntity({
      viewId: parseInt(props.view.id, 10),
      visualMetadata: { ...props.visualMetaData, conditionExpression: props.conditionExpression },
    });
  };

  const clear = () => {
    props.updateConditionExpression(null);
  };

  useEffect(() => {
    if (props.visualMetaData.conditionExpression) {
      props.updateConditionExpression(props.visualMetaData.conditionExpression);
    }
  }, []);

  useEffect(() => {
    const _remountComponentKey = remountComponentKey + 1;
    setRemountComponentKey(_remountComponentKey);
  }, [props.conditionExpression]);

  useEffect(() => {
    if (props.validateQueryResponse.validationResultType === 'SUCCESS' && isSaveCalled) {
      save();
      setIsSaveCalled(false);
    }
  }, [props.validateQueryResponse]);

  const validateQuery = () => {
    setIsSaveCalled(true);
    const wrap = VisualWrap(props.visualMetaData);
    props.validate({
      datasourceId: props.view.viewDashboard.dashboardDatasource.id,
      visualMetadataId: props.visualMetaData.id,
      queryDTO: wrap.getQueryParameters(props.visualMetaData, {}, null, null),
      conditionExpression: props.conditionExpression
    });
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
        {props.conditionExpression && <Condition key={remountComponentKey} condition={props.conditionExpression} />}
        <Flex direction="row" justifyContent="space-between" marginTop="size-100">
          <Flex gap="size-100">
            {props.validateQueryResponse?.error && (
              <React.Fragment>
                <Alert color="Informative" />
                <span className="spectrum-Body-emphasis">{props.validateQueryResponse?.error}</span>
              </React.Fragment>
            )}
          </Flex>
          <Flex gap="size-100">
            <Button variant="cta" onPress={clear}>
              <Translate contentKey="entity.action.clear">Clear</Translate>
            </Button>
            <Button variant="cta" onPress={validateQuery} isDisabled={props.updating}>
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
          </Flex>
        </Flex>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  conditionExpression: storeState.visualmetadata.conditionExpression,
  visualMetaData: storeState.visualmetadata.entity,
  updating: storeState.visualmetadata.updating,
  view: storeState.views.entity,
  validateQueryResponse: storeState.visualmetadata.validateQueryResponse,
});
const mapDispatchToProps = {
  updateConditionExpression,
  updateEntity,
  validate,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataConstraints);
