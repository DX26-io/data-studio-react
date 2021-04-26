import React from 'react';
import { Button, Flex, Text, View } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import PermissionsTitle from '../permissions-title';

export interface IDatasourcePermissionTitleProps {
  handleSaveClick?: () => void;
  updating: boolean;
}

const DatasourcePermissionTitle: React.FC<IDatasourcePermissionTitleProps> = props => {
  const { handleSaveClick, updating } = props;

  const save = () => {
    handleSaveClick();
  };

  return (
    <View borderBottomWidth="thin" borderColor="default" height="size-700">
      <Flex justifyContent="space-between" justifySelf="center" alignItems="center">
        <PermissionsTitle />
        {handleSaveClick && (
          <Flex alignItems="center" alignContent="end" justifyContent="end">
            <Button onPress={save} variant="cta" marginEnd="size-250" isDisabled={updating}>
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
          </Flex>
        )}
      </Flex>
    </View>
  );
};
export default DatasourcePermissionTitle;
