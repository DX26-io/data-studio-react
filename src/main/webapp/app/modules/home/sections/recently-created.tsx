import React, { useState, ReactText } from 'react';
import { Item, Content, View } from '@adobe/react-spectrum';
import { Tabs } from '@react-spectrum/tabs';
import { translate } from 'react-jhipster';

const RecentlyCreated: React.FC = () => {
  const [tabId, setTabId] = useState<ReactText>();

  const tabs = [
    { id: 1, name: 'home.bottom.tabs.created.tabs.recentlyCreatedBookmarks' },
    { id: 2, name: 'home.bottom.tabs.created.tabs.recentlyCreatedViews' },
  ];

  return (
    <Tabs aria-label="top-tabs" items={tabs} selectedKey={tabId} onSelectionChange={setTabId}>
      {item => (
        <Item title={translate(item.name)}>
          <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
            {tabId === 1 ? <View></View> : <View></View>}
          </Content>
        </Item>
      )}
    </Tabs>
  );
};

export default RecentlyCreated;
