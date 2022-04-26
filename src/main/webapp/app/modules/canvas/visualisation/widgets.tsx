import React from 'react';
import VisualisationHeader from './visualisation-modal/visualisation-header';
import { NoDataFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { IIllustrate } from './manage-widgets';
import { VisualisationType } from 'app/shared/util/visualisation.constants';
import { createEntity as addVisualmetadataEntity } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';

interface IWidgetsProps extends StateProps, DispatchProps {
  isLoaderDisplay: IIllustrate[];
  v: IVisualMetadataSet;
  i:number;
}
const Widgets = (props: IWidgetsProps) => {
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
        ></VisualisationHeader>
      </div>
      <div
        style={{ backgroundColor: props.v.bodyProperties.backgroundColor, opacity: props.v.bodyProperties.opacity }}
        className="visualBody"
        id={`visualBody-${props.v.id}`}
      >
        <div className="illustrate">
          {props.isLoaderDisplay[props.i]?.noDataFoundVisibility && (
            <div
              style={{ display: props.isLoaderDisplay[props.i]?.noDataFoundVisibility ? 'block' : 'none' }}
              className={`dataNotFound dataNotFound-${props.v.id}`}
            >
              <NoDataFoundPlaceHolder />
            </div>
          )}
        </div>
        <div id={`visualisation-${props.v.id}`} className="visualisation">
          {props.v.metadataVisual.name === VisualisationType.Iframe && (
            <iframe style={{ textAlign: 'center', position: 'relative', border: 0, overflow: 'hidden' }} id={`iframe-${props.v.id}`} />
          )}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Widgets);
