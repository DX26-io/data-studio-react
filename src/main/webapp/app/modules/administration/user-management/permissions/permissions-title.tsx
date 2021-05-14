import React from 'react';
import { Button, Flex, Text, View } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';

const PermissionsTitle = () => {
  return (
    <Flex justifyContent="start" alignItems="center" alignContent="start">
      <p className="spectrum-Heading spectrum-Heading--sizeS" style={{ padding: '15px 22px' }}>
        <Translate contentKey="permissions.home.administrators">Administrators</Translate>
      </p>
    </Flex>
  );
};
export default PermissionsTitle;
