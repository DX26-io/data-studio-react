import React from 'react';
import { Button, Flex, Text, View } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';

export interface IPermissionTitleProps {
  handleSaveClick?: () => void;
}

const PermissionTitle = (props: IPermissionTitleProps) => {
  const { handleSaveClick } = props;

  const save = () => {
    handleSaveClick();
  };

  return (
    <View borderBottomWidth="thin" borderColor="default" height="size-700">
      <Flex justifyContent="space-between">
        <Flex justifyContent="center" alignItems="center">
          <p className="spectrum-Heading spectrum-Heading--sizeS" style={{ padding: '15px 22px' }}>
            <Translate contentKey="permissions.home.administrators">Administrators</Translate>
          </p>
        </Flex>
        {handleSaveClick && (
          <Flex alignItems="end">
            <p className="spectrum-Heading spectrum-Heading--sizeS" style={{ padding: '15px 22px' }}>
              <Button onPress={save} variant="cta">
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </p>
          </Flex>
        )}
      </Flex>
    </View>
  );
};
export default PermissionTitle;
