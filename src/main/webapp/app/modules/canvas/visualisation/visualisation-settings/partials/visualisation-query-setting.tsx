import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';


const VisualisationQuerySetting = (props) => {
  return (
    <>
      <View>
        <span className="query"> {props.validateQueryError ? props.validateQueryError : props.validateQueryResponse?.rawQuery}</span>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  validateQueryResponse: storeState.visualmetadata.validateQueryResponse,
  validateQueryError: storeState.visualmetadata.validateQueryError,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(VisualisationQuerySetting);