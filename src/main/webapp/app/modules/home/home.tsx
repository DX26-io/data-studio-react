import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import { ActionButton, Flex, Heading, Text, View } from '@adobe/react-spectrum';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { useHistory } from 'react-router-dom';

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
