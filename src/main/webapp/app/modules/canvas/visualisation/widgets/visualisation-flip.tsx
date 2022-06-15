import React from 'react';
import VisualisationHeader from './visualisation-header';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { createEntity as addVisualmetadataEntity } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';
import { TextField, Flex, Text, ActionButton } from '@adobe/react-spectrum';
import { isFeatureExist, isDefaultFeatureEmpty } from 'app/entities/visualmetadata/visualmetadata-util';
import { addFieldDimension, addFieldMeasure } from 'app/entities/visualmetadata/visualmetadata-util';
import { VisualWrap } from '../util/visualmetadata-wrapper';
import { addField, deleteField, updateField } from 'app/entities/visualmetadata/visualmetadata.reducer';
import LockClosed from '@spectrum-icons/workflow/LockClosed';
import Measure from '@spectrum-icons/workflow/Measure';
import Dimension from '@spectrum-icons/workflow/OutlinePath';
import Close from '@spectrum-icons/workflow/Close';
import OutlinePath from '@spectrum-icons/workflow/OutlinePath';
import { DIMENSION, MEASURE } from 'app/shared/util/visualisation.constants';

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
      }
    }
  };

  const onDragOver = e => {
    event.preventDefault();
  };

  const styles = {
    dropZoneHeading: {
      paddingInlineStart: '0px',
      paddingInlineEnd: '0px',
      borderWidth: 'var(--spectrum-alias-border-size-thin)',
      borderColor: 'var(--spectrum-alias-border-color)',
      borderRadius: 'var(--spectrum-alias-border-radius-regular)',
      margin: '5px',
      padding: '5px',
    },
    featureHeading: {
      listStyle: 'none',
      marginTop: '5px',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: `var(
        --spectrum-alias-background-color-gray-75,
        var(--spectrum-global-color-gray-75, var(--spectrum-semantic-gray-75-color-background))
      )`,
    },
    uncontrolledDropBox: {
      listStyle: 'none',
      marginTop: '5px',
      marginBottom: '5px',
    },
    controlledDropBox: {
      listStyle: 'none',
      marginTop: '10px',
      marginBottom: '10px',
    },
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
        <ol style={styles.dropZoneHeading}>
          <li style={styles.featureHeading}>
            <Flex direction="row">
              <Text>Dimensions</Text>
              <div style={{ marginLeft: 'auto' }}>
                {' '}
                <OutlinePath size="S" />
              </div>
            </Flex>
          </li>
          {props.v.fields
            .filter(f => f.fieldType.featureType === 'DIMENSION')
            .map((field, i) => (
              <React.Fragment key={i + 'drop-box'}>
                <li onDragOver={onDragOver} onDrop={onDrop} style={styles.controlledDropBox}>
                  <Flex direction="row">
                    <TextField
                      icon={field.fieldType.constraint === 'REQUIRED' ? <LockClosed size="S" /> : null}
                      id={props.v.fields.indexOf(field).toString()}
                      placeholder="Drop here"
                      type="text"
                      isReadOnly
                      name="dimension-item"
                      value={field?.feature?.definition}
                      width={'100%'}
                    />
                    {field.fieldType.constraint === 'OPTIONAL' && field.feature != null && (
                      <ActionButton
                        isQuiet
                        marginStart={'auto'}
                        onPress={() => {
                          props.deleteField(props.v, field);
                        }}
                      >
                        {' '}
                        <Close size="S" />
                      </ActionButton>
                    )}
                  </Flex>
                </li>
              </React.Fragment>
            ))}
          {props.v?.nextFieldDimension(props.v.fields, props.v.metadataVisual) !== undefined &&
            isDefaultFeatureEmpty(props.v.fields, DIMENSION) && (
              <li style={styles.uncontrolledDropBox} onDragOver={onDragOver} onDrop={onDrop}>
                <TextField width={'100%'} name="dimension-item" id="-1" placeholder="Drop here" type="text" isReadOnly />
              </li>
            )}
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
  deleteField,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationBack);
