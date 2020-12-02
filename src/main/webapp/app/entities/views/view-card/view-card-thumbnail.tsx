import React from 'react';
import { Image, Flex } from '@adobe/react-spectrum';
import { DisplayNamePlaceholder } from 'app/shared/components/placeholder/placeholder';
import { Link } from 'react-router-dom';

interface IViewCardThumbnailProps {
  thumbnailImagePath: string;
  viewName: string;
  viewId: number;
  dashboardId: number;
}

const ViewCardThumbnail: React.FC<IViewCardThumbnailProps> = ({ thumbnailImagePath, viewName, viewId, dashboardId }) => {
  return (
    <Link to={`/dx26/dashboard/${dashboardId}/views/${viewId}/build`} className="thumbnail">
      <Flex alignItems="center" justifyContent="center" minHeight="static-size-1700" maxHeight="static-size-1700">
        {thumbnailImagePath != null ? (
          <Image src={thumbnailImagePath} alt={viewName} objectFit="cover" />
        ) : (
          <DisplayNamePlaceholder displayName={viewName} />
        )}
      </Flex>
    </Link>
  );
};

export default ViewCardThumbnail;
