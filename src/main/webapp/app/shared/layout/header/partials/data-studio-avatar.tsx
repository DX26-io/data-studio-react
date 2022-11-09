import React, { useEffect } from 'react';
import { ActionButton, Button, Content, Dialog, DialogTrigger, Divider, Flex, Text } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import User from '@spectrum-icons/workflow/User';
import LogOut from '@spectrum-icons/workflow/LogOut';
import Settings from '@spectrum-icons/workflow/Settings';

const DataStudioAvatar: React.FC = () => {
  const history = useHistory();
  const account = useSelector((storeState: IRootState) => storeState.authentication.account);
  const profileIconStyle = {
    backgroundColor: `var(
      --spectrum-alias-background-color-gray-75,
      var(--spectrum-global-color-gray-75, var(--spectrum-semantic-gray-75-color-background))
    )`,
    borderRadius: '50%',
    width: '40px',
    height: '40px',
  };

  const menus = [
    {
      key: '0',
      link: `/administration/account`,
      title: 'header.avatar.account',
      routeUrl:"/account",
      icon:<Settings size="S" marginStart={'auto'} />,
      dataTestid:"preferencesButton"
    },
    {
      key: '1',
      link: `/logout`,
      title: 'header.avatar.signOut',
      routeUrl:"/logout",
      icon:<LogOut size="S" marginStart={'auto'}  />,
      dataTestid:"logoutButton"
    },
  ];

  const menuElements = menus.map(menu => (
    <li
      className="dx26-list"
      data-testid={menu.dataTestid}
      style={{
        backgroundColor: `var(
      --spectrum-alias-background-color-gray-100,
      var(--spectrum-global-color-gray-100, var(--spectrum-semantic-gray-100-color-background))
    )`,
        listStyle: 'none',
        padding: '10px',
        margin: '5px',
        width: '23vw',
        marginLeft: '-38px',
      }}
      draggable
      key={menu.key}
      onClick={() => history.push(menu.routeUrl)}
    >
      <Flex direction="row">
        <Text><Translate contentKey={menu.title}></Translate></Text>
        {menu.icon}
      </Flex>
    </li>
  ));

  return (
    <DialogTrigger type="popover">
      <ActionButton UNSAFE_style={profileIconStyle} aria-label="User avatar" isQuiet={true} marginEnd="size-200" data-testid="avatarButton">
        <User size="M" />
      </ActionButton>
      <Dialog>
        <Content UNSAFE_style={{ maxWidth: '100%', overflow: 'hidden' }}>
          <Flex alignItems="center" justifyContent="center" direction="column" gap="size-175">
            <Text>
              <span className="spectrum-Body spectrum-Body--sizeL" data-testid="userGreeting">
                <Translate contentKey="header.avatar.greeting">Hello</Translate>
                <strong>{` ${account.login}`}</strong> <span>[{`${account.currentRealm?.name}`}]</span>
              </span>
            </Text>
            <Divider size="M" />
            {/* <Button variant="primary" data-testid="preferencesButton">
              <Text>
                <Translate contentKey="header.avatar.account">Account</Translate>
              </Text>
            </Button>
            <Button onPress={() => history.push('/logout')} variant="primary" justifySelf="center" data-testid="logoutButton">
              <Text>
                <Translate contentKey="header.avatar.signOut">Sign Out</Translate>
              </Text>
            </Button> */}
            <ol>{menuElements}</ol>
          </Flex>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};
export default DataStudioAvatar;
