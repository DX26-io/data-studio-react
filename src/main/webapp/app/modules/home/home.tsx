import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, Heading, View, Text, Item, Content } from '@adobe/react-spectrum';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';

import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { useHistory } from 'react-router-dom';
import { Tabs } from '@react-spectrum/tabs';

export type IHomeProp = StateProps;

// TODO: Test Cases
export const Home = (props: IHomeProp) => {
  const history = useHistory();
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
          </View>
          <ActionButton onPress={() => history.push('/dashboards')}>
            <ViewGrid />
            <Text>Dashboards</Text>
          </ActionButton>
          <Tabs aria-label="History of Ancient Rome">
            <Item title="Founding of Rome" key="FoR">
              <Content marginTop="size-250" marginStart="size-125">
                <Text>Arma virumque cano, Troiae qui primus ab oris.</Text>
              </Content>
            </Item>
            <Item title="Monarchy and Republic" key="MaR">
              <Content marginTop="size-250" marginStart="size-125">
                <Text>Senatus Populusque Romanus.</Text>
              </Content>
            </Item>
            <Item title="Empire" key="Emp">
              <Content marginTop="size-250" marginStart="size-125">
                <Text>Alea jacta est.</Text>
              </Content>
            </Item>
          </Tabs>
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
