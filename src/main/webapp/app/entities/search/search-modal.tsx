import React, { useEffect, useState } from 'react';
import {
  View,
  Flex,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  ButtonGroup,
  Button,
  TextField,
  TextArea,
  AlertDialog,
  DialogContainer,
} from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {translate, Translate} from 'react-jhipster';
import { RouteComponentProps} from 'react-router-dom';
import {resetSearch} from "app/entities/search/search.reducer";

export interface ISearchModalProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string, viewId: string }> {}

const SearchModal = (props: ISearchModalProps) => {
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (!props.isSearchOpen) {
      props.history.push(`/dashboards/${props.match.params.id}/${props.match.params.viewId}/build`);
    }
  }, [props.isSearchOpen]);

  const handleClose = () => {
    props.resetSearch();
  };

  const handleSearchClick = () => {

  };

  return (
    <>
      <DialogContainer type="fullscreenTakeover"
                       onDismiss={handleClose}>
        <Dialog>
          <Heading>
            <Translate contentKey="views.search.title">_Search</Translate>
          </Heading>
          <Divider />
          <Content>
            <Flex direction="column" gap="size-100" alignItems="center">
              <View padding="size-600">
                <Form isRequired
                      necessityIndicator="icon"
                      minWidth="size-4600">
                  <TextField
                    label={translate('views.search.search')}
                    value={searchText}
                    onChange={setSearchText}
                  />
                </Form>
              </View>
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
});

const mapDispatchToProps = {
  resetSearch,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
