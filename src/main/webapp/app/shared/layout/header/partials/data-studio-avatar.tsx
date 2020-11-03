import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, Flex, Text, View } from '@adobe/react-spectrum';
import { Avatar } from '@material-ui/core';
import HeaderPopover from 'app/shared/layout/header/partials/header-popover';
import { Translate } from 'react-jhipster';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

const DataStudioAvatar: React.FC = () => {
  const avatarStyles = makeStyles(theme => ({
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
  }));
  const avatarClasses = avatarStyles();
  const history = useHistory();
  const account = useSelector((storeState: IRootState) => storeState.authentication.account);

  return (
    <>
      <HeaderPopover
        icon={
          <Avatar className={avatarClasses.small}>
            <span className="avatar-initial">H</span>
          </Avatar>
        }
      >
        <View padding="size-300">
          <Flex alignItems="center" justifyContent="center" direction="column">
            <span className="spectrum-Body spectrum-Body--L">
              <Text marginBottom="size-200">
                <Translate contentKey="header.avatar.greeting">Hello</Translate>
                {` ${account.login}`}
              </Text>
            </span>
            <Divider marginY="size-200" size="S" />
            <Button isQuiet={true} variant="primary" marginBottom="size-200">
              <Text>
                <Translate contentKey="header.avatar.preferences">Preferences</Translate>
              </Text>
            </Button>
            <Button onPress={() => history.push('/logout')} variant="primary" justifySelf="center">
              <Text>
                <Translate contentKey="header.avatar.signOut">Sign Out</Translate>
              </Text>
            </Button>
          </Flex>
        </View>
      </HeaderPopover>
    </>
  );
};

export default DataStudioAvatar;
