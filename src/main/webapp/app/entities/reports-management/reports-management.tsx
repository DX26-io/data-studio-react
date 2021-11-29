import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import Report from '@spectrum-icons/workflow/Report';
import Feed from '@spectrum-icons/workflow/Feed';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import LinkCard from 'app/shared/components/link-card/link-card';
import { translate } from 'react-jhipster';

const ReportsManagement = (props: RouteComponentProps) => {
  const { match } = props;

  const reportsManagementList = [
    {
      icon: <Report size="L" />,
      link: `${match.url}/reports`,
      title: 'reportsManagement.reports.title',
      description: 'reportsManagement.reports.description',
    },
    {
      icon: <Feed size="L" />,
      link: `${match.url}/reports-logger`,
      title: 'reportsManagement.taskLogger.title',
      description: 'reportsManagement.taskLogger.description',
    },
  ];
  return (
    <>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('reportsManagement.home.title'), route: '/administration/report-management' },
        ]}
        title={translate('reportsManagement.home.title')}
      />
      <Flex direction="row" gap="size-700" justifyContent="center" height="100%" marginTop="10%">
        {reportsManagementList.map(card => (
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

export default ReportsManagement;
