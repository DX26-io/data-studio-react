import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Provider, defaultTheme, View, Grid } from '@adobe/react-spectrum'

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
    return (
    <Provider theme={defaultTheme}>
      <Grid
        areas={['sidebar content']}
        columns={['1fr', '3fr']}
        height="size-6000"
        gap="size-100">
        <View >side bar</View>
        <View >content</View>
      </Grid>
    </Provider>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
