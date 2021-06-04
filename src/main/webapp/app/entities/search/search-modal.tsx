import React, {useEffect, useState} from 'react';
import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Form,
  Heading,
  Item,
  ListBox,
  Text,
  TextField, View,
} from '@adobe/react-spectrum';
import {IRootState} from 'app/shared/reducers';
import {connect} from 'react-redux';
import {translate, Translate} from 'react-jhipster';
import {RouteComponentProps} from 'react-router-dom';
import {disconnectSocket, receiveSocketResponse, resetSearch, searchChange, doSearch} from "app/entities/search/search.reducer";
import {forwardCall, searchCall, searchItemSelected} from "app/shared/websocket/proxy-websocket.service";
import Search from "@spectrum-icons/workflow/Search";
import VisualizationSettings from "app/modules/canvas/visualization/visualization-settings/visualization-settings";
import VisualizationProperties
  from "app/modules/canvas/visualization/visualization-properties/visualization-properties";
import {
  getEntity as getVisualmetadataEntity, metadataContainerUpdate,
  setEditAction,
  setVisual, updateEntity as updateVisualmetadataEntity
} from "app/entities/visualmetadata/visualmetadata.reducer";
import {getViewFeaturesEntities} from "app/entities/feature/feature.reducer";
import {getEntity as getViewEntity} from "app/entities/views/views.reducer";
import {renderVisualization, ValidateFields} from "app/modules/canvas/visualization/util/visualization-render-utils";
import {subscribeWebSocket} from "app/shared/websocket/stomp-client.service";
import {VisualWrap} from "app/modules/canvas/visualization/util/visualmetadata-wrapper";

export interface ISearchModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string, viewId: string }> {}

const SearchModal = (props: ISearchModalProps) => {
  // const visualizationId = props.visualizationId;

  const viewId = props.match.params.viewId;

  const closeSearch = () => {
    props.history.push(`/dashboards/${props.match.params.id}/${props.match.params.viewId}/build`);
  };

  useEffect(() => {
    if (!props.isSearchOpen) {
      closeSearch();
    }
  }, [props.isSearchOpen]);

  useEffect(() => {
    props.receiveSocketResponse();
    return props.disconnectSocket;
  }, []);

  const onExchangeMetadata = data => {
    const metaData = data.body === '' ? { data: [] } : JSON.parse(data.body);
    renderVisualization(props.visualmetadataEntity, metaData.data, 'visualization-edit');
  };

  const onExchangeMetadataError = data => {
    const body = JSON.parse(data.body || '{}');
  };

  useEffect(() => {
    props.setVisual(props.visualmetadataEntity);
    if (props.visualmetadataEntity.fields && ValidateFields(props.visualmetadataEntity.fields)) {
      subscribeWebSocket('/user/exchange/metaData/' + props.visualmetadataEntity.id, onExchangeMetadata);
      subscribeWebSocket('/user/exchange/metaDataError', onExchangeMetadataError);
      const visualMetadata = VisualWrap(props.visualmetadataEntity);
      const queryDTO = visualMetadata.getQueryParameters(props.visualmetadataEntity, null, null, null);
      const body = {
        queryDTO,
        visualMetadata,
        validationType: 'REQUIRED_FIELDS',
        actionType: null,
        type: 'share-link',
      };
      forwardCall(props.view?.viewDashboard?.dashboardDatasource?.id, body, props.view.id);
    }
  }, [props.visualmetadataEntity]);

  const handleClose = () => {
    props.resetSearch();
  };

  const handleSearchClick = () => {

  };

  const onSearchPressed = () => {
    props.doSearch(viewId, props.searchText);
  }

  const onSearchTextChange = (value) => {
    props.searchChange(viewId, value);
  };

  const onAutoSuggestionItemChange = (selectedSet) => {
    const item = props.autoSuggestion.find((ft) => selectedSet.has(ft.text));
    if (item) {
      searchItemSelected(viewId, {text: props.searchText, item: item.text});
    }
  };

  const rendering = props.showResults  ? (
    <Flex direction="row" height="size-600" gap="size-75">
      <Flex direction="column" height="100%" flex gap="size-75">
        <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight="100%">
          <div style={{height: '100%'}} id={`visualization-edit-${props.visualmetadataEntity.id}`}
               className="visualization"></div>
        </View>
      </Flex>
    </Flex>
  ) : null;

  return (
    <>
      <DialogContainer type="fullscreenTakeover"
                       onDismiss={handleClose}>
        <Dialog>
          <Heading>
            <Translate contentKey="views.search.title">_Search</Translate>
          </Heading>
          <Divider/>
          <Content>
              <Form isRequired
                    necessityIndicator="icon"
                    width="100%">
                <Flex direction="column" gap="size-100">
                  <Text>
                    <Translate contentKey="views.search.search">_Search</Translate>
                  </Text>
                  <Flex direction="row" width="100%" alignContent="end">
                    <TextField
                      width="100%"
                      label={translate('views.search.search')}
                      value={props.searchText}
                      onChange={onSearchTextChange}
                    />
                    <ActionButton onPress={() => onSearchPressed()} aria-label="{translate('views.menu.search')}">
                      <Search size="M" />
                    </ActionButton>
                  </Flex>
                  {rendering}
                  <ListBox
                    aria-label="Auto-suggestions"
                    selectionMode="single"
                    onSelectionChange={onAutoSuggestionItemChange}
                    items={props.autoSuggestion}>
                    {(item) => <Item key={item.text}>{item.text}</Item>}
                  </ListBox>
                </Flex>
              </Form>
          </Content>
          <ButtonGroup>
            <Button variant="secondary"
                    onPress={handleClose}
                    isQuiet={true}>
              <Translate contentKey="entity.action.cancel">_Cancel</Translate>
            </Button>
            <Button onPress={handleSearchClick} variant="primary">
              <Translate contentKey="entity.action.pin">_Pin</Translate>
            </Button>
            <Button onPress={handleSearchClick} variant="primary">
              <Translate contentKey="entity.action.savebookmark">_Save</Translate>
            </Button>
            <Button onPress={handleSearchClick} variant="primary">
              <Translate contentKey="entity.action.createview">_Create</Translate>
            </Button>
          </ButtonGroup>
        </Dialog>
      </DialogContainer>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  isSearchOpen: storeState.search.isSearchOpen,
  autoSuggestion: storeState.search.autoSuggestion,
  searchText: storeState.search.searchText,
  showResults: storeState.search.showResults,
  searchStruct: storeState.search.searchStruct,
  visualmetadataEntity: storeState.visualmetadata.entity,
  view: storeState.views.entity,
});

const mapDispatchToProps = {
  resetSearch,
  receiveSocketResponse,
  disconnectSocket,
  searchChange,
  doSearch,
  setVisual,
  getVisualmetadataEntity,
  getViewFeaturesEntities,
  getViewEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
