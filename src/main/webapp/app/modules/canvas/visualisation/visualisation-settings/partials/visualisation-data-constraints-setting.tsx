import React, { useEffect } from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import VisualisationDataConstraints from 'app/modules/canvas/data-constraints/visualisation-data-constraints';
import { IFeature } from 'app/shared/model/feature.model';
import { IDatasources } from 'app/shared/model/datasources.model';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
export interface IVisualisationDataConstraintsSettingProps {
  features: readonly IFeature[];
  datasource: IDatasources;
  visualMetaData: IVisualMetadataSet;
  filterData: any;
}

const VisualisationDataConstraintsSetting = (props: IVisualisationDataConstraintsSettingProps) => {
  return (
    <>
      <View>
        <VisualisationDataConstraints
          features={props.features}
          datasource={props.datasource}
          visualMetaData={props.visualMetaData}
          condition={props.visualMetaData.conditionExpression}
          filterData={props.filterData}
        ></VisualisationDataConstraints>
      </View>
    </>
  );
};

export default VisualisationDataConstraintsSetting;
