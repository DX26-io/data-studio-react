import React from 'react';
import { View, Flex, Dialog, Heading, Divider, Content, ButtonGroup, Button, DialogContainer } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import './dx26-modal.css';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import IDx26Properties from './partials/dx26-properties';
import IDx26Settings from './partials/dx26-settings';
import { Translate } from 'react-jhipster';

export interface IDx26ModalProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id: string; viewId: string; visualizationId: string }> {}

const Dx26Modal = (props: IDx26ModalProps) => {
  const history = useHistory();
  const handleClose = () => {
    history.push('/dashboards/' + props.match.params.id + '/' + props.match.params.viewId + '/build');
  };
  return (
    <>
      <DialogContainer type="fullscreenTakeover" onDismiss={handleClose}>
        <Dialog>
          <Heading level={6}>Visualization Title</Heading>
          <Divider />
          <ButtonGroup>
            <Button variant="secondary" onPress={handleClose}>
              <Translate contentKey="entity.action.discard">Discard</Translate>
            </Button>
            <Button variant="secondary" onPress={handleClose}>
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
            <Button variant="cta" onPress={handleClose}>
              <Translate contentKey="entity.action.apply">Apply</Translate>
            </Button>
          </ButtonGroup>
          <Content>
            <Flex direction="row" height="100%" gap="size-75">
              <View borderWidth="thin" borderColor="default" borderRadius="regular" flex>
                <Flex direction="column" height="100%" flex gap="size-75">
                  <View borderWidth="thin" borderColor="default" borderRadius="regular" height="50%" />
                  <View borderWidth="thin" borderColor="default" borderRadius="regular" height="50%">
                    <IDx26Settings />
                  </View>
                </Flex>
              </View>
              <View borderWidth="thin" borderColor="default" borderRadius="regular" width="size-4000">
                <IDx26Properties />
              </View>
            </Flex>
          </Content>
        </Dialog>
      </DialogContainer>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26Modal);
