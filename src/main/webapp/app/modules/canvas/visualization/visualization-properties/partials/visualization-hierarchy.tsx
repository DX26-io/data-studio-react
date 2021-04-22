import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

export interface IVisualizationHierarchyProps {}

const VisualizationHierarchy = (props: IVisualizationHierarchyProps) => {
  return (
    <>
      <View>Hierarchy display here</View>
    </>
  );
};

export default (VisualizationHierarchy);
