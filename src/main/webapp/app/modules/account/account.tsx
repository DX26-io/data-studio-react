import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import UserLock from '@spectrum-icons/workflow/UserLock';
import LockClosed from '@spectrum-icons/workflow/LockClosed';
import LinkCard from 'app/shared/components/link-card/link-card';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { translate } from 'react-jhipster';

const Account: React.FC = () => {
  const accountList = [
    {
      icon: <UserLock size="L" />,
      link: `/account`,
      title: 'account.accountSettings.title',
      description: 'account.accountSettings.description',
    },
    {
      icon: <LockClosed size="L" />,
      link: `/account/password`,
      title: 'account.password.title',
      description: 'account.password.description',
    },
  ];

  return (
    <View>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('account.title'), route: '/account' },
        ]}
        title={translate('account.title')}
      ></SecondaryHeader>
      <Flex direction="row" gap="size-1000" justifyContent="center" margin="size-1000">
        {accountList.map(card => (
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
    </View>
  );
};

export default Account;
