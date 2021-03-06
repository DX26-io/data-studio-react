import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import TableView from 'app/shared/components/table/table';

export interface IVisualizationDataSettingProps {
  data?: any;
}

const VisualizationDataSetting = (props: IVisualizationDataSettingProps) => {
  return (
    <>
      <View>{props.data && props.data.length > 0 && <TableView data={props.data} />}</View>
    </>
  );
};

export default VisualizationDataSetting;
