import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Scheduler from 'app/modules/canvas/scheduler/scheduler';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
export interface IVisualizationThresholdAlertSettingProps  {
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

export default (VisualizationThresholdAlertSetting);
