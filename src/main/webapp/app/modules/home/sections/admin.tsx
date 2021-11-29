import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import User from '@spectrum-icons/workflow/User';
import UserGroup from '@spectrum-icons/workflow/UserGroup';
import UserLock from '@spectrum-icons/workflow/UserLock';
import DataSettings from '@spectrum-icons/workflow/DataSettings';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import LinkCard from 'app/shared/components/link-card/link-card';
import PlatformDataMapping from '@spectrum-icons/workflow/PlatformDataMapping';
import Data from '@spectrum-icons/workflow/Data';
import FileGear from '@spectrum-icons/workflow/FileGear';
import DataUser from '@spectrum-icons/workflow/DataUser';
import AssetsPublished from '@spectrum-icons/workflow/AssetsPublished';
import ColorPalette from '@spectrum-icons/workflow/ColorPalette';

const Admin: React.FC = () => {
  const adminList = [
    {
      icon: <User size="L" />,
      link: `/administration/user-management/users`,
      title: 'userManagement.home.title',
      description: 'userManagement.home.description',
    },
    {
      icon: <UserGroup size="L" />,
      link: `/administration/user-management/groups`,
      title: 'userGroups.home.title',
      description: 'userGroups.home.description',
    },
    {
      icon: <UserLock size="L" />,
      link: `/administration/user-management/dashboard-permissions`,
      title: 'permissions.dashboardPermissions.title',
      description: 'permissions.dashboardPermissions.description',
    },
    {
      icon: <DataSettings size="L" />,
      link: `/administration/user-management/datasource-permissions`,
      title: 'permissions.datasourcePermissions.title',
      description: 'permissions.datasourcePermissions.description',
    },
    {
      icon: <DataUser size="L" />,
      link: `/administration/user-management/datasource-constraints`,
      title: 'permissions.datasourceConstraints.title',
      description: 'permissions.datasourceConstraints.description',
    },
    {
      icon: <PlatformDataMapping size="L" />,
      link: `/administration/sources/connections`,
      title: 'connections.home.title',
      description: 'connections.home.description',
    },
    {
      icon: <Data size="L" />,
      link: `/administration/sources/datasources`,
      title: 'datasources.home.title',
      description: 'datasources.home.description',
    },
    {
      icon: <FileGear size="L" />,
      link: `/administration/reports-configuration`,
      title: 'reportsManagement.reportConfiguration.title',
      description: 'reportsManagement.reportConfiguration.description',
    },
    {
      icon: <AssetsPublished size="L" />,
      link: `/administration/release-management`,
      title: 'releases.home.title',
      description: 'releases.home.description',
    },
    {
      icon: <ColorPalette size="L" />,
      link: `/administration/visualization-colors`,
      title: 'visualizationcolors.home.title',
      description: 'visualizationcolors.home.description',
    },
  ];
  return (
    <Flex direction="row" gap="size-175" justifyContent="start" alignItems="start" wrap>
      {adminList.map(card => (
        <LinkCard
          key={card.link}
          icon={card.icon}
          link={card.link}
          title={card.title}
          description={card.description}
          paddingXStyle="size-175"
          paddingYStyle="size-500"
        />
      ))}
    </Flex>
  );
};

export default Admin;
