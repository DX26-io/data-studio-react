// import './secondary-header.scss';

import React, { PropsWithChildren } from 'react';
import { View, Flex } from '@adobe/react-spectrum';
import { Link, RouteComponentProps } from 'react-router-dom';
import User from '@spectrum-icons/workflow/User';
import UserGroup from '@spectrum-icons/workflow/UserGroup';
import UserLock from '@spectrum-icons/workflow/UserLock';
import DataSettings from '@spectrum-icons/workflow/DataSettings';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import AdminCard from 'app/shared/components/admin/admin-card';

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
      link: `${match.url}/dashboard-permission`,
      title: 'permission.dashboardPermission.title',
      description: 'permission.dashboardPermission.description',
    },
    {
      icon: <DataSettings size="L" />,
      link: `${match.url}/datasource-permission`,
      title: 'permission.datasourcePermission.title',
      description: 'permission.datasourcePermission.description',
    },
  ];
  return (
    <View backgroundColor="default">
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'User Management', route: '/administration/user-management' },
        ]}
        title={'User Management'}
      ></SecondaryHeader>
      <Flex direction="row" gap="size-700" alignItems="center" justifyContent="center" height="100%" marginTop="10%">
        {userManagementList.map(card => (
          <AdminCard key={card.link} icon={card.icon} link={card.link} title={card.title} description={card.description} />
        ))}
      </Flex>
    </View>
  );
};

export default UserManagement;
