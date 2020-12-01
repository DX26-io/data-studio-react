import './dashboard-card-thumbnail.scss';
import React from 'react';
import { Image, Flex } from '@adobe/react-spectrum';
import { DisplayNamePlaceholder } from 'app/shared/components/placeholder/placeholder';
import { Link, match } from 'react-router-dom';

interface IDashboardCardThumbnailProps {
  thumbnailImagePath: string;
  dashboardName: string;
  dashboardId: number;
  match: match;
}

const DashboardCardThumbnail: React.FC<IDashboardCardThumbnailProps> = ({ thumbnailImagePath, dashboardName, dashboardId, match }) => {
  return (
    <Link to={`${match.url}/${dashboardId}`} className="thumbnail">
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
