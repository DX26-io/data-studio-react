import React, {useEffect, useState} from 'react';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Form,
  Heading,
  ListBox,
  Text,
  TextField,
} from '@adobe/react-spectrum';
import {IRootState} from 'app/shared/reducers';
import {connect} from 'react-redux';
import {translate, Translate} from 'react-jhipster';
import {RouteComponentProps} from 'react-router-dom';
import {disconnectSocket, receiveSocketResponse, resetSearch} from "app/entities/search/search.reducer";
import {searchCall} from "app/shared/websocket/proxy-websocket.service";
import {ListItem} from "@material-ui/core";

export interface ISearchModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string, viewId: string }> {}

const SearchModal = (props: ISearchModalProps) => {
  const viewId = props.match.params.viewId;
  const [searchText, setSearchText] = useState('')

  const closeSearch = () => {
    disconnectSocket();
    props.history.push(`/dashboards/${props.match.params.id}/${props.match.params.viewId}/build`);
  };

  useEffect(() => {
    if (!props.isSearchOpen) {
      closeSearch();
    }
  }, [props.isSearchOpen]);

  useEffect(() => {
    props.receiveSocketResponse();
  }, []);

  const handleClose = () => {
    props.resetSearch();
  };

  const handleSearchClick = () => {

  };

  const load = (value) => {
    searchCall(viewId, {text: value});
  };

  const onSearchTextChange = (value) => {
    setSearchText(value);
    load(value);
  };

  const onAutoSuggestionItemChange = (selectedSet) => {
    const item = props.autoSuggestion.find((ft) => selectedSet.has(ft.text));
    setSearchText(item.text);
  };

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
            <Flex direction="column" gap="size-100" alignItems="center">
              <Form isRequired
                    necessityIndicator="icon"
                    width="100%">
                <Text>
                  <Translate contentKey="views.search.search">_Search</Translate>
                </Text>
                <TextField
                  label={translate('views.search.search')}
                  value={searchText}
                  onChange={onSearchTextChange}
                />
                <ListBox
                  aria-label="Auto-suggestions"
                  selectionMode="single"
                  onSelectionChange={onAutoSuggestionItemChange}
                  items={props.autoSuggestion}>
                  {(item) => <ListItem key={item.text}>{item.text}</ListItem>}
                </ListBox>
              </Form>
            </Flex>
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
});

const mapDispatchToProps = {
  resetSearch,
  receiveSocketResponse,
  disconnectSocket,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
