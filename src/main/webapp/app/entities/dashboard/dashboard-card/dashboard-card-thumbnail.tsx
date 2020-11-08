import React from 'react';
import { Image, View, Flex } from '@adobe/react-spectrum';
import { DisplayNamePlaceholder } from 'app/shared/components/placeholder/placeholder';

interface IDashboardCardThumbnailProps {
  thumbnailImagePath: string;
  dashboardName: string;
}

const DashboardCardThumbnail: React.FC<IDashboardCardThumbnailProps> = ({ thumbnailImagePath, dashboardName }) => {
  return (
    <Flex alignItems="center" justifyContent="center" minHeight="static-size-1700" maxHeight="static-size-1700">
      {thumbnailImagePath != null ? (
        <Image src={thumbnailImagePath} alt={dashboardName} objectFit="cover" />
      ) : (
        <DisplayNamePlaceholder displayName={dashboardName} />
      )}
    </Flex>
  );
};

export default DashboardCardThumbnail;
