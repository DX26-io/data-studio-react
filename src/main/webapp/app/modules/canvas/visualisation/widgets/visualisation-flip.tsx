import React from 'react';
import VisualisationHeader from './visualisation-header';
import { NoDataFoundPlaceHolder } from 'app/shared/components/placeholder/placeholder';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { IIllustrate } from './manage-widgets';
import { VisualisationType } from 'app/shared/util/visualisation.constants';
import { createEntity as addVisualmetadataEntity } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';
import { TextField } from '@adobe/react-spectrum';
import { isFeatureExist } from 'app/entities/visualmetadata/visualmetadata-util';
import { addFieldDimension, addFieldMeasure } from 'app/entities/visualmetadata/visualmetadata-util';
import { VisualWrap } from '../util/visualmetadata-wrapper';
import { addField, deleteField, updateField } from 'app/entities/visualmetadata/visualmetadata.reducer';

interface IVisualisationBackProps extends StateProps, DispatchProps {
  v: IVisualMetadataSet;
  i: number;
  handleFlipClick: (isFlipped) => void;
  isFlipped: boolean;
}
const VisualisationBack = (props: IVisualisationBackProps) => {
  const visualWrap = VisualWrap(props.v);

  const handlevisualisationClick = v => {
    props.addVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: props.v,
    });
  };

  const onDrop = e => {
    const tagName = e.target.tagName.toLowerCase();
    let field = null;
    if (tagName === 'input') {
      if (isFeatureExist(props.v.fields, props.draggedFeature)) {
        if (e.target.name === 'dimension-item' && props.draggedFeature.featureType === 'DIMENSION') {
          if (e.target.id === '-1') {
            field = addFieldDimension(visualWrap, props.v);
            if (field) {
              props.addField(props.v, field);
            }
          } else {
            field = props.v.fields[e.target.id];
            props.v.fields[e.target.id].feature = props.draggedFeature;
            props.updateField(props.v, field);
          }
        }
        if (e.target.name === 'measure-item' && props.draggedFeature.featureType === 'MEASURE') {
          if (e.target.id === '-1') {
            field = addFieldMeasure(visualWrap, props.v);
            if (field) {
              props.addField(props.v, field);
            }
          } else {
            field = props.v.fields[e.target.id];
            props.v.fields[e.target.id].feature = props.draggedFeature;
            props.updateField(props.v, field);
          }
        }
        // const cl = e.target.className;
        // const id = e.target.id;
      }
    }
  };

  const onDragOver = e => {
    event.preventDefault();
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
        <ol>
          {props.v.fields.map(field => (
            <li
              // className={field.feature.featureType === 'DIMENSION' ? 'dimension-item' : 'measure-item'}
              key={field.feature.name}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <TextField
                id={props.v.fields.indexOf(field).toString()}
                placeholder="Drop here"
                type="text"
                isReadOnly
                name={field.feature.featureType === 'DIMENSION' ? 'dimension-item' : 'measure-item'}
                value={field.feature.definition}
              />
            </li>
          ))}
        </ol>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  view: storeState.views.entity,
  isEditMode: storeState.visualmetadata.isEditMode,
  visualMetadataContainerList: storeState.visualmetadata.visualMetadataContainerList,
  draggedFeature: storeState.visualmetadata.draggedFeature,
});

const mapDispatchToProps = {
  addVisualmetadataEntity,
  addField,
  updateField,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationBack);
