import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import {Flex, View, Heading} from '@adobe/react-spectrum'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export type IHomeProp = StateProps;

// TODO: Test Cases
export const Home = (props: IHomeProp) => {
  const { account } = props;

  return (
    <View padding={'size-150'}>
      <Flex justifyContent={'center'} alignItems={'center'} direction={'column'}>
        {account && account.login ? (
          <View>
            <Heading level={1}>
              You are logged in as &quot;<span className="username">{account.login}</span>&quot;
            </Heading>
          </View>
        ):(
          <View>
            <Heading>You are not currently logged in!</Heading>
          </View>
        )}
        <Card className="root" variant="outlined">
          <CardContent>
            <Typography className="title" color={'textSecondary'} gutterBottom>
              // TODO
            </Typography>
            <Typography variant="h5" component={'h2'}>
              Home Screen
            </Typography>
            <Typography className="pos" color={'textSecondary'}>
              Status: Design stage
            </Typography>
            <Typography variant="body2" component={'p'}>
              Work related to the UI will start once the UI design is done!
            </Typography>
          </CardContent>
        </Card>
      </Flex>
    </View>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
