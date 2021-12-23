import React from 'react';
import { Flex, ActionButton } from '@adobe/react-spectrum';
import uuid from 'react-uuid';
import { updateConditionExpression } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import AddCircle from '@spectrum-icons/workflow/AddCircle';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import { applyChanges, depthFirstVisit } from './data-constraints.util';

interface IAddRemoveActionProps extends StateProps, DispatchProps {
  _condition: any;
}

const AddRemoveAction = (props: IAddRemoveActionProps) => {
  const addComposition = () => {
    const changes = [];
    depthFirstVisit(props.conditionExpression, function (current, previous, previousLeaf, parent) {
      if (current.uuid === props._condition.uuid) {
        const newCurrent = {
          firstExpression: { ...props._condition },
          '@type': 'Or',
          secondExpression: {
            uuid: uuid(),
            '@type': 'Compare',
            comparatorType: 'EQ',
            valueType: {
              '@type': 'valueType',
              value: '',
              type: '',
            },
            valueTypes: [],
          },
        };
        newCurrent['uuid'] = props._condition.uuid;
        newCurrent.firstExpression.uuid = uuid();
        changes.push(newCurrent);
      }
    });
    const conditionExpression = applyChanges(props.conditionExpression, changes);
    props.updateConditionExpression(conditionExpression);
  };

  const removeCondition = () => {
    if (props.conditionExpression.uuid === props._condition.uuid) {
      props.updateConditionExpression(null);
    } else {
      const changes = [];
      depthFirstVisit(props.conditionExpression, function (current, previous, previousLeaf, parent) {
        if (current.uuid === props._condition.uuid) {
          let newParent;
          if (parent.firstExpression && parent.firstExpression.uuid === props._condition.uuid) {
            newParent = { ...parent.secondExpression };
          } else if (parent.secondExpression && parent.secondExpression.uuid === props._condition.uuid) {
            newParent = { ...parent.firstExpression };
          }
          if (newParent) {
            newParent.uuid = parent.uuid;
            changes.push(newParent);
          }
        }
      });
      const conditionExpression = applyChanges(props.conditionExpression, changes);
      props.updateConditionExpression(conditionExpression);
    }
  };

  return (
    <>
      <Flex direction="row" gap="size-50">
        <ActionButton
          onPress={() => {
            addComposition();
          }}
          isQuiet={true}
        >
          <AddCircle />
        </ActionButton>
        <ActionButton
          onPress={() => {
            removeCondition();
          }}
          isQuiet={true}
        >
          <RemoveCircle />
        </ActionButton>
      </Flex>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  conditionExpression: storeState.visualmetadata.conditionExpression,
  visualMetaData: storeState.visualmetadata.entity,
});
const mapDispatchToProps = {
  updateConditionExpression,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AddRemoveAction);
