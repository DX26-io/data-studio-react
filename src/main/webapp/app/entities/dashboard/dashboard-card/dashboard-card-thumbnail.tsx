import './dashboard-card-thumbnail.scss'
import React from 'react';
import { Image, Flex } from '@adobe/react-spectrum';
import { DisplayNamePlaceholder } from 'app/shared/components/placeholder/placeholder';

interface IDashboardCardThumbnailProps {
  thumbnailImagePath: string;
  dashboardName: string;
  dashboardId: number;
}

const DashboardCardThumbnail: React.FC<IDashboardCardThumbnailProps> = ({ thumbnailImagePath, dashboardName, dashboardId }) => {
  return (
    <a href={'/views?viewDashboard=' + dashboardId + '&page=1&sort=id,asc'} className={'thumbnail'}>
      <Flex alignItems="center" justifyContent="center" minHeight="static-size-1700" maxHeight="static-size-1700">
        {thumbnailImagePath != null ? (
          <Image src={thumbnailImagePath} alt={dashboardName} objectFit="cover" />
        ) : (
          <DisplayNamePlaceholder displayName={dashboardName} />
        )}
      </Flex>
    </a>
  );
};

export default DashboardCardThumbnail;
