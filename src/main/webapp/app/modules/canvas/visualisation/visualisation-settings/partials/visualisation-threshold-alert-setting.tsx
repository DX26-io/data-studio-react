import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import Scheduler from 'app/modules/canvas/scheduler/scheduler';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
export interface IVisualisationThresholdAlertSettingProps  {
  visual: IVisualMetadataSet;
  thresholdAlert:boolean
}

const VisualisationThresholdAlertSetting = (props: IVisualisationThresholdAlertSettingProps) => {
  return (
    <>
      <View>
        <Scheduler visual={props.visual} thresholdAlert={props.thresholdAlert} />
      </View>
    </>
  );
};

export default (VisualisationThresholdAlertSetting);
