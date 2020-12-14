import React from 'react';
import { Image, Flex } from '@adobe/react-spectrum';
import { DisplayNamePlaceholder } from 'app/shared/components/placeholder/placeholder';
import { Link } from 'react-router-dom';

interface IViewCardThumbnailProps {
  thumbnailImagePath: string;
  viewName: string;
  url : string
}

const ViewCardThumbnail: React.FC<IViewCardThumbnailProps> = ({ url,thumbnailImagePath, viewName }) => {
  return (
    <Link to={url} className="thumbnail">

    <Flex alignItems="center" justifyContent="center" minHeight="static-size-1700" maxHeight="static-size-1700">
      {thumbnailImagePath != null ? (
        <Image src={'http://localhost:8002/' + thumbnailImagePath} alt={viewName} objectFit="cover" />
      ) : (
        <DisplayNamePlaceholder displayName={viewName} />
      )}
    </Flex>
    </Link>
  );
};

export default ViewCardThumbnail;
