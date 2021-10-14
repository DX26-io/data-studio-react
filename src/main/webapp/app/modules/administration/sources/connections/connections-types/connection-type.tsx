import React from 'react';
import { Flex, View, Link as SpectrumLink, Text, Divider, Button } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { selectConnectionType } from '../connection-steps.reducer';
import { updateIsSelectedConnectionType } from '../../connections/connection.reducer';
import { connect } from 'react-redux';

interface IConnectionTypeProps extends DispatchProps {
  connectionType: any;
}

const ConnectionType = (props: IConnectionTypeProps) => {
  const { connectionType } = props;
  const imgUrl = 'content/images/databases/' + connectionType.name + '.svg';

  return (
    <View borderColor="light" borderWidth="thin" margin="size-100" padding="size-100" backgroundColor="gray-50">
      <Flex alignItems="center" justifyContent="center" gap="size-500">
        <img style={{ width: '60px', height: '60px' }} src={imgUrl} />
        <Text>
          <strong>{connectionType.connectionPropertiesSchema.connectionDetailsType}</strong>
        </Text>
      </Flex>
      <Divider size="M" marginTop="size-100" marginBottom="size-100" />
      <Flex alignItems="end" justifyContent="end">
        <Button
          variant={connectionType.isSelected ? 'cta' : 'primary'}
          onPress={() => {
            connectionType.isSelected = !connectionType.isSelected;
            props.selectConnectionType(connectionType);
            props.updateIsSelectedConnectionType(connectionType.id);
          }}
        >
          <Translate contentKey="connections.connectionsTypes.select">Select</Translate>
        </Button>
      </Flex>
    </View>
  );
};

const mapDispatchToProps = { selectConnectionType, updateIsSelectedConnectionType };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(ConnectionType);
