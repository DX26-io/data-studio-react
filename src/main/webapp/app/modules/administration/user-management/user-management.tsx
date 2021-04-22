// import './secondary-header.scss';

import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import User from '@spectrum-icons/workflow/User';
import UserGroup from '@spectrum-icons/workflow/UserGroup';
import UserLock from '@spectrum-icons/workflow/UserLock';
import DataSettings from '@spectrum-icons/workflow/DataSettings';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import LinkCard from 'app/shared/components/link-card/link-card';

const UserManagement = (props: RouteComponentProps) => {
  const { match } = props;

  const userManagementList = [
    {
      icon: <User size="L" />,
      link: `${match.url}/users`,
      title: 'userManagement.home.title',
      description: 'userManagement.home.description',
    },
    {
      icon: <UserGroup size="L" />,
      link: `${match.url}/groups`,
      title: 'userGroups.home.title',
      description: 'userGroups.home.description',
    },
    {
      icon: <UserLock size="L" />,
      link: `${match.url}/dashboard-permissions`,
      title: 'permissions.dashboardPermissions.title',
      description: 'permissions.dashboardPermissions.description',
    },
    {
      icon: <DataSettings size="L" />,
      link: `${match.url}/datasource-permissions`,
      title: 'permissions.datasourcePermissions.title',
      description: 'permissions.datasourcePermissions.description',
    },
  ];
  return (
    <>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'User Management', route: '/administration/user-management' },
        ]}
        title={'User Management'}
      />
      <Flex direction="row" gap="size-700" justifyContent="center" height="100%" marginTop="10%">
        {userManagementList.map(card => (
          <LinkCard
            key={card.link}
            icon={card.icon}
            link={card.link}
            title={card.title}
            description={card.description}
            paddingXStyle="size-700"
            paddingYStyle="size-1000"
          />
        ))}
      </Flex>
    </>
  );
};

export default UserManagement;
