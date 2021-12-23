import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

const VisualisationQuerySetting = props => {
  return (
    <>
      <View>
        <span className="query">
          {' '}
          {props.validateQueryResponse?.error ? props.validateQueryResponse?.error : props.validateQueryResponse?.rawQuery}
        </span>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  validateQueryResponse: storeState.visualmetadata.validateQueryResponse,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(VisualisationQuerySetting);
