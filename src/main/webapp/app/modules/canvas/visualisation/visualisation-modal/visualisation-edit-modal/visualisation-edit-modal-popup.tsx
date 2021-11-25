import React, { useEffect, useState } from 'react';
import {
  View,
  Flex,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup,
  Button,
  useDialogContainer,
  ActionButton,
} from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import './visualisation-edit-modal.scss';
import { useHistory } from 'react-router-dom';
import VisualisationProperties from 'app/modules/canvas/visualisation/visualisation-properties/visualisation-properties';
import VisualisationSettings from 'app/modules/canvas/visualisation/visualisation-settings/visualisation-settings';
import { Translate } from 'react-jhipster';
import {
  getEntity as getVisualMetadataEntity,
  updateEntity as updateVisualmetadataEntity,
  setVisual,
  setEditAction,
  metadataContainerUpdate,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { getEntity as getViewEntity } from 'app/entities/views/views.reducer';
import {
  getVisualisationData,
  getVisualisationShareData,
  renderVisualisation,
  ValidateFields,
} from '../../util/visualisation-render-utils';
import { VisualWrap } from '../../util/visualmetadata-wrapper';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { receiveSocketResponseByVisualId } from 'app/shared/websocket/websocket.reducer';
import { IViews } from 'app/shared/model/views.model';
import { getConditionExpression } from 'app/modules/canvas/filter/filter-util';
import TreeCollapse from '@spectrum-icons/workflow/TreeCollapse';
import TreeExpand from '@spectrum-icons/workflow/TreeExpand';
import { validate as validateQuery } from 'app/entities/visualmetadata/visualmetadata.reducer';

export interface IVisualisationEditModalPopUpProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
}

export const VisualisationEditModalPopUp = (props: IVisualisationEditModalPopUpProps) => {
  const [toggleVisualisation, setToggleVisualisation] = useState(true);
  const [visualisationData, setData] = useState<any>();
  const dialog = useDialogContainer();

  const handleClose = action => {
    props.setEditAction(action);
    props.setOpen(false);
    props.setVisual(props.visualMetadataEntity);
    dialog.dismiss();
  };

  const handleApply = () => {
    getVisualisationShareData(props.visualMetadataEntity, props.view, props.selectedFilters);
  };

  const handleSave = () => {
    props.updateVisualmetadataEntity({
      viewId: props.view.id,
      visualMetadata: props.visualMetadataEntity,
    });
    props.metadataContainerUpdate(props.visualMetadataEntity.id, props.visualMetadataEntity, 'id');
    handleClose('save');
  };

  useEffect(() => {
    if (props.visualMetadataEntity.id) {
      props.getVisualMetadataEntity(props.visualMetadataEntity.id);
    }
  }, []);

  const _validateQuery = () => {
    const wrap = VisualWrap(props.visualMetadataEntity);
    props.validateQuery({
      datasourceId: props.view.viewDashboard.dashboardDatasource.id,
      visualMetadataId: props.visualMetadataEntity.id,
      queryDTO: wrap.getQueryParameters(props.visualMetadataEntity, {}, null, null),
    });
  };

  useEffect(() => {
    if (props.visualMetadataEntity.fields && ValidateFields(props.visualMetadataEntity.fields)) {
      props.receiveSocketResponseByVisualId(props.visualMetadataEntity.id);
      const visualMetadata = VisualWrap(props.visualMetadataEntity);
      const queryDTO = visualMetadata.getQueryParameters(
        props.visualMetadataEntity,
        props.selectedFilters,
        getConditionExpression(props.selectedFilters),
        0
      );
      const body = {
        queryDTO,
        visualMetadata,
        validationType: 'REQUIRED_FIELDS',
        actionType: null,
        type: 'share-link',
      };
      _validateQuery();
      forwardCall(props.view?.viewDashboard?.dashboardDatasource?.id, body, props.view.id);
    }
  }, [props.visualMetadataEntity]);

  useEffect(() => {
    if (props.visualDataById && toggleVisualisation) {
      if (props.visualDataById?.data.length > 0) {
        renderVisualisation(props.visualMetadataEntity, props.visualDataById?.data, 'visualisation-edit', props);
        setData(props.visualDataById?.data);
      }
    }
  }, [props.visualDataById, toggleVisualisation]);

  return (
    <Dialog>
      <Heading level={4}>{props.visualMetadataEntity?.titleProperties?.titleText}</Heading>
      <Divider size={'S'} />
      <ButtonGroup>
        <Button
          variant="secondary"
          onPress={() => {
            handleClose('discard');
          }}
        >
          <Translate contentKey="entity.action.discard">Discard</Translate>
        </Button>
        <Button variant="secondary" onPress={handleSave}>
          <Translate contentKey="entity.action.save">Save</Translate>
        </Button>
        <Button
          variant="cta"
          onPress={() => {
            handleApply();
          }}
        >
          <Translate contentKey="entity.action.apply">Apply</Translate>
        </Button>
      </ButtonGroup>
      <Content>
        <Flex direction="row" height="100%" gap="size-75">
          <Flex flex>
            <Flex direction="column" height="100%" flex gap="size-75">
              <Flex justifyContent="end">
                <ActionButton
                  marginEnd={'-10px'}
                  isQuiet
                  onPress={() => {
                    setToggleVisualisation(!toggleVisualisation);
                  }}
                >
                  {toggleVisualisation ? <TreeCollapse size="S" /> : <TreeExpand size="S" />}
                </ActionButton>
              </Flex>
              {toggleVisualisation && (
                <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight="50%">
                  <div
                    style={{ height: '100%' }}
                    id={`visualisation-edit-${props.visualMetadataEntity.id}`}
                    className="visualisation"
                  ></div>
                </View>
              )}
              <div className="settings-tab">
                <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight="50%">
                  <VisualisationSettings />
                </View>
              </div>
            </Flex>
          </Flex>
          <div className="properties-tab">
            <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight="100%">
              <VisualisationProperties />
            </View>
          </div>
        </Flex>
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualMetadataEntity: storeState.visualmetadata.entity,
  featuresList: storeState.feature.entities,
  view: storeState.views.entity,
  visualDataById: storeState.visualisationData.visualDataById,
  hierarchies: storeState.hierarchies.hierarchies,
  selectedFilters: storeState.filter.selectedFilters,
  filterData: storeState.visualisationData.filterData,
});

const mapDispatchToProps = {
  setVisual,
  setEditAction,
  getVisualMetadataEntity,
  getViewEntity,
  updateVisualmetadataEntity,
  metadataContainerUpdate,
  receiveSocketResponseByVisualId,
  validateQuery,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualisationEditModalPopUp);
