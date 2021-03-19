import React from 'react';
import { Flex, View, Link as SpectrumLink, Text, Divider, Button } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';
import { selectConnectionType } from './datasource-steps.reducer';
import { connect } from 'react-redux';

interface IConnectionTypeProps extends DispatchProps {
  connectionType: any;
}

const ConnectionType = (props: IConnectionTypeProps) => {
  const { connectionType } = props;
  const [isSelected, setIsSelected] = React.useState(false);
  const imgUrl = 'content/images/databases/' + connectionType.name + '.svg';

  return (
    <View borderColor="light" borderWidth="thin" margin="size-100" padding="size-100" backgroundColor="gray-50">
      <Flex alignItems="center" justifyContent="center" gap="size-200">
        <img style={{ width: '60px', height: '60px' }} src={imgUrl} />
        <Text>
          <strong>{connectionType.connectionPropertiesSchema.connectionDetailsType}</strong>
        </Text>
      </Flex>
      <Divider size="M" marginTop="size-100" marginBottom="size-100" />
      <Flex alignItems="end" justifyContent="end">
        <Button
          variant={isSelected ? 'cta' : 'primary'}
          onPress={() => {
            setIsSelected(!isSelected);
            props.selectConnectionType(connectionType);
          }}
        >
          <Translate contentKey="datasources.connectionsTypes.select">Select</Translate>
        </Button>
      </Flex>
    </View>
  );
};

const mapDispatchToProps = { selectConnectionType };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(ConnectionType);
