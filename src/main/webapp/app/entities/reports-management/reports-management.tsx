import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import Report from '@spectrum-icons/workflow/Report';
import Feed from '@spectrum-icons/workflow/Feed';
import FileGear from '@spectrum-icons/workflow/FileGear';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import LinkCard from 'app/shared/components/link-card/link-card';
import { translate } from 'react-jhipster';

const ReportsManagement = (props: RouteComponentProps) => {
  const { match } = props;

  const reportsManagementList = [
    {
      icon: <Report size="L" />,
      link: `${match.url}/reports`,
      title: 'reports.home.subTitle',
      description: 'reports.home.description',
    },
    {
      icon: <Feed size="L" />,
      link: `${match.url}/reports-logger`,
      title: 'reports.taskLogger.title',
      description: 'reports.taskLogger.description',
    },
  ];
  return (
    <>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('reports.home.title'), route: '/administration/report-management' },
        ]}
        title={translate('reports.home.title')}
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
