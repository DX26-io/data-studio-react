import React from 'react';
import { Translate } from 'react-jhipster';
import { View } from '@react-spectrum/view';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { Flex } from '@adobe/react-spectrum';

const PasswordResetSuccess = () => (
  <View padding="size-250" backgroundColor="gray-75" width={'40%'} marginStart={'30%'} marginEnd={'30%'} marginTop="size-250">
    <Flex alignItems="center" justifyContent="center">
      <Alert severity="success">
        <Translate contentKey="global.messages.success">Your password has been reset. Please </Translate>
        <Link to="/signin">
          {' '}
          <Translate contentKey="global.messages.info.authenticated.link">sign in</Translate>
        </Link>
      </Alert>
    </Flex>
  </View>
);

export default PasswordResetSuccess;
