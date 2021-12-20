import React, { useState } from 'react';
import { Flex, ActionButton } from '@adobe/react-spectrum';
import uuid from 'react-uuid';
import { updateConditionExpression } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Condition from './condition';
import Select from 'react-select';
import { COMPOSITE_TYPES } from './data-constraints.util';

interface IAndOrConditionProps extends StateProps, DispatchProps {
  _condition: any;
}

const AndOrCondition = (props: IAndOrConditionProps) => {
  const [compositeType, setCompositeType] = useState();
  return (
    <>
      <div className="condition-component-wrapper">
        <Condition condition={props._condition.firstExpression} />
        <Select
          onChange={selected => {
            props._condition['@type'] = selected.value;
            setCompositeType(selected);
          }}
          className="basic-single"
          classNamePrefix="select"
          value={compositeType}
          options={COMPOSITE_TYPES}
        />
        <Condition condition={props._condition.secondExpression} />
      </div>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualMetaData: storeState.visualmetadata.entity,
});
const mapDispatchToProps = {
  updateConditionExpression,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AndOrCondition);
