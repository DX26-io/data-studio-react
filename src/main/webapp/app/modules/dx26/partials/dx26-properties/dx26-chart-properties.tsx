import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

export interface IDx26ChartPropertiesProps extends StateProps, DispatchProps {}

const Dx26ChartProperties = (props: IDx26ChartPropertiesProps) => {
  return (
    <>
      <View>chart properties display here</View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26ChartProperties);
