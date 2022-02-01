import React from 'react';
import { Flex } from '@adobe/react-spectrum';
import AddCircle from '@spectrum-icons/workflow/AddCircle';
import Visibility from '@spectrum-icons/workflow/Visibility';
import QuickLinkCard from 'app/shared/components/quick-link-card';

const QuickStart: React.FC = () => {
  const quickStartList = [
    {
      link: `/dashboards/create`,
      title: 'home.top.tabs.quickStart.newDashboard',
      icon: <AddCircle size="M" />,
    },
    {
      link: `/administration/sources/datasources`,
      title: 'home.top.tabs.quickStart.newDatasource',
      icon: <AddCircle size="M" />,
    },
    {
      link: `/dashboards`,
      title: 'home.top.tabs.quickStart.viewDashboards',
      icon: <Visibility size="M" />,
    },
    {
      link: `/reports-management/reports`,
      title: 'home.top.tabs.quickStart.reportManagement',
      icon: <Visibility size="M" />,
    },
    {
      link: `/bookmarks`,
      title: 'home.top.tabs.quickStart.bookmarks',
      icon: <Visibility size="M" />,
    },
  ];

  return (
    <Flex direction="row" gap="size-150" justifyContent="start" alignItems="start" wrap>
      {quickStartList.map(card => (
        <QuickLinkCard key={card.link} link={card.link} title={card.title} icon={card.icon} />
      ))}
    </Flex>
  );
};

export default QuickStart;
