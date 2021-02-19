import React from 'react';
import { Flex } from '@adobe/react-spectrum';
import ImgLinkCard from './img-link-card';

interface IConnectionsTypesProps {
  connectionsTypes: Array<any>;
}

const ConnectionsTypes: React.FC<IConnectionsTypesProps> = ({ connectionsTypes }) => {
  return (
    <Flex direction="row" gap="size-200" justifyContent="start" wrap>
      {connectionsTypes.map(connectionType => (
        <ImgLinkCard
          key={connectionType.connectionPropertiesSchema.imagePath}
          connectionType={connectionType}
          // imgId={connectionType.connectionPropertiesSchema.imagePath}
          // title={connectionType.connectionPropertiesSchema.connectionDetailsType}
        />
      ))}
    </Flex>
  );
};

export default ConnectionsTypes;
