import React from 'react';
import { Flex } from '@adobe/react-spectrum';
import ConnectionType from './connection-type';

interface IConnectionsTypesProps {
  connectionsTypes: Array<any>;
}

const ConnectionsTypes: React.FC<IConnectionsTypesProps> = ({ connectionsTypes }) => {
  return (
    <Flex direction="row" gap="size-200" justifyContent="start" wrap>
      {connectionsTypes.map(connectionType => (
        <ConnectionType
          key={connectionType.connectionPropertiesSchema.imagePath}
          connectionType={connectionType}
        />
      ))}
    </Flex>
  );
};

export default ConnectionsTypes;
