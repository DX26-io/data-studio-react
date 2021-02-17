import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

export interface IVisualizationHierarchyProps extends StateProps, DispatchProps {}

const VisualizationHierarchy = (props: IVisualizationHierarchyProps) => {
  return (
    <>
      <View>Hierarchy display here</View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationHierarchy);
