import React from 'react';
import { Image, Flex } from '@adobe/react-spectrum';
import { DisplayNamePlaceholder } from 'app/shared/components/placeholder/placeholder';
interface IViewCardThumbnailProps {
  thumbnailImagePath: string;
  viewName: string;
}

const ViewCardThumbnail: React.FC<IViewCardThumbnailProps> = ({ thumbnailImagePath, viewName }) => {
  return (
    <Flex alignItems="center" justifyContent="center" minHeight="static-size-1700" maxHeight="static-size-1700">
      {thumbnailImagePath != null ? (
        <Image src={'http://localhost:8002/' + thumbnailImagePath} alt={viewName} objectFit="cover" />
      ) : (
        <DisplayNamePlaceholder displayName={viewName} />
      )}
    </Flex>
  );
};

export default ViewCardThumbnail;
