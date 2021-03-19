import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Scheduler from 'app/modules/canvas/scheduler/scheduler';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
export interface IVisualizationThresholdAlertSettingProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
}

const VisualizationThresholdAlertSetting = (props: IVisualizationThresholdAlertSettingProps) => {
  return (
    <>
      <View>
        <Scheduler visual={props.visual} />
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationThresholdAlertSetting);
