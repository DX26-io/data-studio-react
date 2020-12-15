import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

export interface IDx26ThresholdAlertSettingsProps extends StateProps, DispatchProps {}

const Dx26ThresholdAlertSettings = (props: IDx26ThresholdAlertSettingsProps) => {
  return (
    <>
      <View>Threshold Alert display here</View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26ThresholdAlertSettings);
