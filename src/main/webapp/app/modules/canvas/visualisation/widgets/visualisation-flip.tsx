import React from 'react';
import VisualisationHeader from './visualisation-header';
import { NoDataFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { IIllustrate } from './manage-widgets';
import { VisualisationType } from 'app/shared/util/visualisation.constants';
import { createEntity as addVisualmetadataEntity } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';

interface IVisualisationBackProps extends StateProps, DispatchProps {
  v: IVisualMetadataSet;
  i: number;
  handleFlipClick: (isFlipped) => void;
  isFlipped:boolean
}
const VisualisationBack = (props: IVisualisationBackProps) => {

  const handlevisualisationClick = v => {
    props.addVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: props.v,
    });
  };

  return (
    <React.Fragment>
      <div className="header">
        <VisualisationHeader
          key={`viz-header-${props.v.id}`}
          visual={props.v}
          handleVisualisationClick={handlevisualisationClick}
          totalItem={props.visualMetadataContainerList?.length || 0}
          isEditMode={props.isEditMode}
          handleFlipClick={props.handleFlipClick}
          isFlipped={props.isFlipped}
        ></VisualisationHeader>
      </div>
      <div
        style={{ backgroundColor: props.v.bodyProperties.backgroundColor, opacity: props.v.bodyProperties.opacity }}
        className="visualBody"
        id={`visualBody-${props.v.id}`}
      >
          this is back
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isEditMode: storeState.visualmetadata.isEditMode,
  visualMetadataContainerList: storeState.visualmetadata.visualMetadataContainerList,
});

const mapDispatchToProps = {
  addVisualmetadataEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationBack);
