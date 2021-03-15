import React, { useEffect } from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import VisualizationDataConstraints from 'app/modules/canvas/data-constraints/visualization-data-constraints';
import { IFeature } from 'app/shared/model/feature.model';
import { IDatasources } from 'app/shared/model/datasources.model';
import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
export interface IVisualizationDataConstraintsSettingProps extends StateProps, DispatchProps {
  features: readonly IFeature[];
  datasource: IDatasources;
  visualMetaData: IVisualMetadataSet;
  filterData: any;
}

const VisualizationDataConstraintsSetting = (props: IVisualizationDataConstraintsSettingProps) => {
  return (
    <>
      <View>
        <VisualizationDataConstraints
          features={props.features}
          datasource={props.datasource}
          visualMetaData={props.visualMetaData}
          condition={props.visualMetaData.conditionExpression}
          filterData={props.filterData}
        ></VisualizationDataConstraints>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationDataConstraintsSetting);
