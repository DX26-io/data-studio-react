import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import Looks from '@spectrum-icons/workflow/Looks';
import LinkCard from 'app/shared/components/link-card/link-card';

const SuperAdmin: React.FC = () => {
  const superAdminList = [
    {
      icon: <Looks size="L" />,
      link: `/realm-management`,
      title: 'realms.title',
      description: 'realms.description',
    },
  ];
  return (
    <Flex direction="row" gap="size-175" justifyContent="start" alignItems="start" wrap>
      {superAdminList.map(card => (
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

export default SuperAdmin;
