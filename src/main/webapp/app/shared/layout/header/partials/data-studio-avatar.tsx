import React from 'react';
import { ActionButton, Button, Content, Dialog, DialogTrigger, Divider, Flex, Text } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import User from '@spectrum-icons/workflow/User';

const DataStudioAvatar: React.FC = () => {
  const history = useHistory();
  const account = useSelector((storeState: IRootState) => storeState.authentication.account);

  return (
    <DialogTrigger type="popover">
      <ActionButton aria-label="User avatar" isQuiet={true} marginEnd="size-200" data-testid="avatarButton">
        <User size="M" />
      </ActionButton>
      <Dialog>
        <Content UNSAFE_style={{"maxWidth":"100%","overflow":"hidden"}}>
          <Flex alignItems="center" justifyContent="center" direction="column" gap="size-175">
            <Text>
              <span className="spectrum-Body spectrum-Body--sizeL" data-testid="userGreeting">
                <Translate contentKey="header.avatar.greeting">Hello</Translate>
                <strong>{` ${account.login}`}</strong> <span>[{`${account.currentRealm?.name}`}]</span>
              </span>
            </Text>
            <Divider size="M" />
            <Button isQuiet={true} variant="primary" data-testid="preferencesButton">
              <Text>
                <Translate contentKey="header.avatar.preferences">Preferences</Translate>
              </Text>
            </Button>
            <Button onPress={() => history.push('/logout')} variant="primary" justifySelf="center" data-testid="logoutButton">
              <Text>
                <Translate contentKey="header.avatar.signOut">Sign Out</Translate>
              </Text>
            </Button>
          </Flex>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};
export default DataStudioAvatar;
