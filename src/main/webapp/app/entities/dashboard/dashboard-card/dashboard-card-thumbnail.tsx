import './dashboard-card-thumbnail.scss';
import React from 'react';
import { Flex, Image } from '@adobe/react-spectrum';
import { DisplayNamePlaceholder } from 'app/shared/components/placeholder/placeholder';
import { Link } from 'react-router-dom';

interface IDashboardCardThumbnailProps {
  thumbnailImagePath: string;
  dashboardName: string;
  url: string;
}

const DashboardCardThumbnail: React.FC<IDashboardCardThumbnailProps> = ({ thumbnailImagePath, dashboardName, url }) => {
  return (
    <Link to={url} className="thumbnail">
      <Flex alignItems="center" justifyContent="center" minHeight="static-size-1700" maxHeight="static-size-1700">
        {thumbnailImagePath != null ? (
          <Image src={thumbnailImagePath} alt={dashboardName} objectFit="cover" />
        ) : (
          <DisplayNamePlaceholder displayName={dashboardName} />
        )}
      </Flex>
    </Link>
  );
};

export default DashboardCardThumbnail;
