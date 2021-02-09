import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import PlatformDataMapping from '@spectrum-icons/workflow/PlatformDataMapping';
import Data from '@spectrum-icons/workflow/Data';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import LinkCard from 'app/shared/components/link-card/link-card';
import { translate } from 'react-jhipster';

const Sources = (props: RouteComponentProps) => {
  const { match } = props;

  const userManagementList = [
    {
      icon: <PlatformDataMapping size="L" />,
      link: `${match.url}/connections`,
      title: 'connections.home.title',
      description: 'connections.home.description',
    },
    {
      icon: <Data size="L" />,
      link: `${match.url}/datasources`,
      title: 'datasources.home.title',
      description: 'datasources.home.description',
    },
  ];
  return (
    <>
      <SecondaryHeader
        breadcrumbItems={[
          { label: 'Home', route: '/' },
          { label: 'Sources', route: '/administration/sources' },
        ]}
        title={translate('global.menu.admin.sources')}
      />
      <Flex direction="row" gap="size-700" justifyContent="center" height="100%" marginTop="10%">
        {userManagementList.map(card => (
          <LinkCard key={card.link} icon={card.icon} link={card.link} title={card.title} description={card.description} />
        ))}
      </Flex>
    </>
  );
};

export default Sources;
