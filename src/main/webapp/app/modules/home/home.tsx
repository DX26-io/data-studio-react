import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, Heading, View } from '@adobe/react-spectrum';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';

import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { useHistory } from 'react-router-dom';
import { Content } from '@react-spectrum/view';
import { Text } from '@react-spectrum/text';
import { Tabs, Item } from '@react-spectrum/tabs';

export type IHomeProp = StateProps;

// TODO: Test Cases
export const Home = (props: IHomeProp) => {
  const history = useHistory();
  let tabs = [
    {
      id: 1,
      name: 'Founding of Rome',
      children: 'Arma virumque cano, Troiae qui primus ab oris.'
    },
    {
      id: 2,
      name: 'Monarchy and Republic',
      children: 'Senatus Populusque Romanus.'
    },
    {id: 3, name: 'Empire', children: 'Alea jacta est.'}
  ];
  let [tabId, setTabId] = React.useState(1);
  const { account } = props;
  return (
    <>
      <SecondaryHeader breadcrumbItems={[{ label: 'Home', route: '/' }]} title={'Home'} />
      <View padding={'size-150'}>
        <Flex justifyContent={'center'} alignItems={'center'} direction={'column'}>
          <View>
            <Heading level={2}>
              You are logged in as &quot;<span className="username">{account.login}</span>&quot;
            </Heading>
            <Tabs
        aria-label="History of Ancient Rome"
        items={tabs}
        onSelectionChange={setTabId}>
        {(item) => (
          <Item title={item.name}>
            <Content marginTop="size-250" marginStart="size-125">
              <Text>{item.children}</Text>
            </Content>
          </Item>
        )}
      </Tabs>
          </View>
          <ActionButton onPress={() => history.push('/dashboards')}>
            <ViewGrid />
            <Text>Dashboards</Text>
          </ActionButton>
        </Flex>
      </View>
    </>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
