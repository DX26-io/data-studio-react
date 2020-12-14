import React, { useEffect } from 'react';
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
  Text,
  AlertDialog,
  DialogContainer,
} from '@adobe/react-spectrum';
import { Tabs, Item } from '@react-spectrum/tabs';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';

export interface IDx26ModalProps extends StateProps, DispatchProps {}

const Dx26Modal = (props: IDx26ModalProps) => {
  const handleClose = () => {};

  return (
    <>
      <DialogContainer type="fullscreenTakeover" onDismiss={handleClose}>
        <Dialog>
          <Heading>Profile</Heading>
          <Divider />
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button autoFocus variant="cta" onPress={close}>
              Save
            </Button>
          </ButtonGroup>
          <Content>
            <Form>
              <TextField label="Name" />
            </Form>
            <Tabs aria-label="History of Ancient Rome">
              <Item title="Founding of Rome" key="FoR">
                <Content marginTop="size-250" marginStart="size-125">
                  <Text>Arma virumque cano, Troiae qui primus ab oris.</Text>
                </Content>
              </Item>
              <Item title="Monarchy and Republic" key="MaR">
                <Content marginTop="size-250" marginStart="size-125">
                  <Text>Senatus Populusque Romanus.</Text>
                </Content>
              </Item>
              <Item title="Empire" key="Emp">
                <Content marginTop="size-250" marginStart="size-125">
                  <Text>Alea jacta est.</Text>
                </Content>
              </Item>
            </Tabs>
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
