import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { getBookmark, updateBookmark, createBookmark, reset, deleteBookmark, setBookmark } from './bookmark.reducer';
import { IRootState } from 'app/shared/reducers';
import { isFormValid } from './bookmark.util';
import Alert from '@spectrum-icons/workflow/Alert';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';
import { Flex, useDialogContainer, Dialog, Heading, Divider, Content, Form, Button, TextField, Header, Text } from '@adobe/react-spectrum';
import { defaultValue } from 'app/shared/model/error.model';

export interface IBookmarkUpdateProps extends StateProps, DispatchProps {
  setUpdateSuccess: () => void;
  isNew: boolean;
  setOpen: (isOpen: boolean) => void;
  bookmarkName: string;
  history: any;
}

export const UserUpdate = (props: IBookmarkUpdateProps) => {
  const { isNew, setOpen, setUpdateSuccess, bookmarkName, bookmark, loading, updating, fetchSuccess, updateSuccess, history } = props;
  const [error, setError] = useState(defaultValue);

  const dialog = useDialogContainer();

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getBookmark(bookmark.name);
    }
    return () => {
      props.reset();
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    dialog.dismiss();
  };

  //   useEffect(() => {
  //     if (isNew) {
  //       setName('');
  //     } else {
  //       setName(bookmark.name);
  //     }
  //     if (updateSuccess) {
  //       handleClose();
  //       setUpdateSuccess();
  //     }
  //   }, [fetchSuccess, isNew, updateSuccess]);

  //   useEffect(() => {
  //     const errorObj = isFormValid({ ...bookmark, name });
  //     setError(errorObj);
  //   }, [name]);

  const save = () => {
    const values = { ...bookmark, name };
    if (isNew) {
      props.createBookmark(values);
    } else {
      props.updateBookmark(values);
    }
  };

  const remove = () => {
    props.deleteBookmark(bookmark.name);
  };

  return (
    <Dialog data-testid="bookmark-form-dialog">
      <Heading>
        <Flex alignItems="center" gap="size-100" data-testid="bookmark-form-heading">
          {!isNew ? (
            <Translate contentKey="bookmarks.home.editLabel">Edit Bookmark</Translate>
          ) : (
            <Translate contentKey="bookmarks.home.createLabel">Create Bookmark</Translate>
          )}
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
            label={translate('bookmarks.name')}
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
          <div style={{ marginTop: '20px' }}>
            <Flex alignItems="center" gap="size-25">
              <p className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="bookmarks.tip"></Translate>
              </p>
              <AlertCircle size="S" />
            </Flex>
          </div>
          {/* {!isNew ? (
            <React.Fragment>
              <span className="spectrum-Heading spectrum-Heading--sizeXXS">
                <Translate contentKey="entity.action.dangerZone">Danger Zone</Translate>
              </span>
              <Divider size="M" />{' '}
            </React.Fragment>
          ) : null} */}
        </Form>
        {/* {!isNew ? (
          <Button data-testid="delete" variant="negative" onPress={remove} marginTop="size-175">
            <Translate contentKey="entity.action.delete">Delete</Translate>
          </Button>
        ) : null} */}
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
  loading: storeState.bookmarks.loading,
  updating: storeState.bookmarks.updating,
  fetchSuccess: storeState.bookmarks.fetchSuccess,
  updateSuccess: storeState.bookmarks.updateSuccess,
});

const mapDispatchToProps = { getBookmark, updateBookmark, createBookmark, reset, deleteBookmark, setBookmark };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserUpdate);
