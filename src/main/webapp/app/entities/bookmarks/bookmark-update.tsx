import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { getBookmarks, updateBookmark, createBookmark, reset, deleteBookmark, setBookmark } from './bookmark.reducer';
import { IRootState } from 'app/shared/reducers';
import { isFormValid } from './bookmark.util';
import Alert from '@spectrum-icons/workflow/Alert';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';
import { Flex, useDialogContainer, Dialog, Heading, Divider, Content, Form, Button, TextField, Header, Text } from '@adobe/react-spectrum';
import { defaultValue } from 'app/shared/model/error.model';
import { getFilterCriterias } from 'app/modules/canvas/filter/filter-util';

export interface IBookmarkUpdateProps extends StateProps, DispatchProps {
  setOpen: (isOpen: boolean) => void;
}

export const BookmarkUpdate = (props: IBookmarkUpdateProps) => {
  const { setOpen, bookmark, updating, updateSuccess, datasource } = props;
  const [error, setError] = useState(defaultValue);

  const dialog = useDialogContainer();

  useEffect(() => {
    props.setBookmark({ ...bookmark, datasource, featureCriteria: getFilterCriterias(props.selectedFilter, props.features,props.dynamicDateRangeMetaData) });
  }, []);

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
    props.reset();
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
      props.getBookmarks(datasource.id);
    }
  }, [props.updateSuccess]);

  const save = () => {
    props.createBookmark(bookmark);
  };

  const remove = () => {
    props.deleteBookmark(bookmark.id);
  };

  return (
    <Dialog data-testid="bookmark-form-dialog">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="bookmark-form-heading">
          <Translate contentKey="featureBookmark.home.createLabel">Create Bookmark</Translate>
        </Flex>
      </Heading>
      <Header data-testid="bookmark-form-action">
        <Flex alignItems="center" gap="size-100">
          <Button variant="secondary" onPress={handleClose} data-testid="bookmark-form-cancel">
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button variant="cta" onPress={save} isDisabled={updating || !error.isValid} data-testid="bookmark-form-submit">
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <Form data-testid="bookmark-form">
          <TextField
            label={translate('featureBookmark.name')}
            type="text"
            value={bookmark.name ? bookmark.name : ''}
            onChange={event => {
              props.setBookmark({ ...bookmark, name: event });
              const errorObj = isFormValid({ ...bookmark, name: event });
              setError(errorObj);
            }}
            autoFocus
            isRequired
            data-testid="name"
          />
        </Form>
        {!error.isValid && (
          <Flex gap="size-100" data-testid="validation-error" marginTop="static-size-200">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message">
                <Translate contentKey={error.translationKey}></Translate>
              </span>
            </Text>
          </Flex>
        )}
      </Content>
    </Dialog>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  bookmark: storeState.bookmarks.bookmark,
  updating: storeState.bookmarks.updating,
  fetchSuccess: storeState.bookmarks.fetchSuccess,
  updateSuccess: storeState.bookmarks.updateSuccess,
  datasource: storeState.views.entity.viewDashboard.dashboardDatasource,
  selectedFilter: storeState.filter.selectedFilters,
  features: storeState.feature.entities,
  dynamicDateRangeMetaData: storeState.filter.dynamicDateRangeMetaData
});

const mapDispatchToProps = { getBookmarks, updateBookmark, createBookmark, reset, deleteBookmark, setBookmark };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkUpdate);
