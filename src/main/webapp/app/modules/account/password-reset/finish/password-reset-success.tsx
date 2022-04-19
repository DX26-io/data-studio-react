import React from 'react';
import { Translate } from 'react-jhipster';
import { View } from '@react-spectrum/view';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';

const PasswordResetSuccess = () => (
  <View padding="size-250" backgroundColor="gray-75" width={'60%'} marginStart={'20%'} marginEnd={'20%'} marginTop={'5%'}>
    <Alert severity="success">
      <Translate contentKey="global.messages.success">Your password has been reset. Please </Translate>
      <Link to="/signin">
        {' '}
        <Translate contentKey="global.messages.info.authenticated.link">sign in</Translate>
      </Link>
    </Alert>
  </View>
);

export default PasswordResetSuccess;
