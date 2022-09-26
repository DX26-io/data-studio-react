import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import Looks from '@spectrum-icons/workflow/Looks';
import Organisations from '@spectrum-icons/workflow/Organisations';
import LinkCard from 'app/shared/components/link-card/link-card';

const Root: React.FC = () => {
  const rootList = [
    {
      icon: <Organisations size="L" />,
      link: `/organisation-management`,
      title: 'organisations.title',
      description: 'organisations.description',
    },
    {
      icon: <Looks size="L" />,
      link: `/internal-realm-management`,
      title: 'realms.title',
      description: 'realms.description',
    },
  ];
  return (
    <Flex direction="row" gap="size-175" justifyContent="start" alignItems="start" wrap>
      {rootList.map(card => (
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

export default Root;
