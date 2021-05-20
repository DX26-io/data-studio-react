import React from 'react';
import { Button, Flex, Text, View } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import PermissionsTitle from './permissions-title';

export interface IPermissionsActionTitleProps {
  handleClick?: () => void;
  updating: boolean;
  translateActionKey:string
}

const PermissionsActionTitle: React.FC<IPermissionsActionTitleProps> = props => {
  const { handleClick, updating,translateActionKey } = props;

  return (
    <View borderBottomWidth="thin" borderColor="default" height="size-700">
      <Flex justifyContent="space-between" justifySelf="center" alignItems="center">
        <PermissionsTitle />
        {handleClick && (
          <Flex alignItems="center" alignContent="end" justifyContent="end">
            <Button onPress={handleClick} variant="cta" marginEnd="size-250" isDisabled={updating}>
              <Translate contentKey={translateActionKey}></Translate>
            </Button>
          </Flex>
        )}
      </Flex>
    </View>
  );
};
export default PermissionsActionTitle;
