import React from 'react';
import { Text, View } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';

const PermissionTitle = props => (
  <View borderBottomWidth="thin" borderColor="default" height="size-700">
    <p className="spectrum-Heading spectrum-Heading--sizeS" style={{padding: '15px 22px'}}>
      <Translate contentKey="permission.home.administrators">Administrators</Translate>
    </p>
  </View>
);

export default PermissionTitle;
