import React, { useEffect, useRef, useState } from 'react';
import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  useDialogContainer,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Form,
  Heading,
  Item,
  ListBox,
  TextArea,
  View,
} from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate, Translate } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';
import { disconnectSocket, receiveSocketResponse, resetSearch, searchChange, doSearch } from 'app/entities/search/search.reducer';
import { forwardCall, searchCall, searchItemSelected } from 'app/shared/websocket/proxy-websocket.service';
import Search from '@spectrum-icons/workflow/Search';
import {
  getEntity as getVisualmetadataEntity,
  setVisual,
  updateEntity as updateVisualmetadataEntity,
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import { getEntity as getFeatureEntity } from 'app/entities/feature/feature.reducer';
import { getEntity as getViewEntity } from 'app/entities/views/views.reducer';
import { getQueryDTO } from './search.util';
export interface ISearchModalProps extends StateProps, DispatchProps {
  setOpen: (boolean) => void;
  viewId: string;
}

const SearchModal = (props: ISearchModalProps) => {
  const [searchCursorPos, setSearchCursorPos] = useState<number>();

  useEffect(() => {
    props.receiveSocketResponse();
    props.disconnectSocket;
  }, []);
  
    const handleClose = () => {
      props.resetSearch();
      props.setOpen(false)
    };

  const handleSearchClick = () => { };

  const findTableVisualization = visualizations => {
    return visualizations.find(item => {
      return item.name === 'Table';
    });
  };

  const onSearchPressed = () => {
    const queryDTO = getQueryDTO(props.searchText, props.features, props.view, findTableVisualization(props.visualizations));
    props.doSearch(props.viewId, queryDTO);
  };

  const onSearchSelect = event => {
    setSearchCursorPos(event.target.selectionStart);
  };

  const onSearchTextChange = value => {
    props.searchChange(props.viewId, value);
  };

  const onAutoSuggestionItemChange = selectedSet => {
    const item = props.autoSuggestion.find(ft => selectedSet.has(ft.text));
    if (item) {
      searchItemSelected(props.viewId, { text: props.searchText, item: item.text, cursor: searchCursorPos });
    }
  };

  const rendering = props.searchedResults ? (
    <Flex direction="row" height="size-600" gap="size-75">
      <Flex direction="column" height="100%" flex gap="size-75">
        <View borderWidth="thin" borderColor="default" borderRadius="regular" minHeight="100%">
          <div style={{ height: '100%' }} id={`visualization-edit-${props.visualmetadataEntity.id}`} className="visualization"></div>
        </View>
      </Flex>
    </Flex>
  ) : null;

  return (
    <>
      <Dialog>
        <Heading>
          <Translate contentKey="views.search.title">_Search</Translate>
        </Heading>
        <Divider />
        <Content>
          <Form isRequired necessityIndicator="icon" width="100%">
            <Flex alignItems={'center'} direction="column" gap="size-100">
              <Flex alignItems={'center'} direction="row" width="100%" alignContent="end">
                <TextArea
                  onSelect={onSearchSelect}
                  width="100%"
                  labelPosition="side"
                  labelAlign="end"
                  marginX={'size-100'}
                  label={translate('views.search.search')}
                  value={props.searchText}
                  onChange={onSearchTextChange}
                />
                <ActionButton onPress={() => onSearchPressed} aria-label="{translate('views.menu.search')}">
                  <Search size="M" />
                </ActionButton>
              </Flex>
              {rendering}
              <ListBox
                aria-label="Auto-suggestions"
                selectionMode="single"
                onSelectionChange={onAutoSuggestionItemChange}
                items={props.autoSuggestion}
              >
                {item => <Item key={item.text}>{item.text}</Item>}
              </ListBox>
            </Flex>
          </Form>
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={handleClose} isQuiet={true}>
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
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  autoSuggestion: storeState.search.autoSuggestion,
  searchText: storeState.search.searchText,
  searchedResults: storeState.search.searchedResults,
  searchStruct: storeState.search.searchStruct,
  visualmetadataEntity: storeState.visualmetadata.entity,
  features: storeState.feature.entities,
  visualizations: storeState.visualizations.entities,

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
  getViewEntity,
  getFeatureEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
