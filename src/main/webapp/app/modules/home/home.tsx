import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

export type IHomeProp = StateProps;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
   
    color: theme.palette.text.secondary,
  },
}));
export const Home = (props: IHomeProp) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h2>
              <Translate contentKey="home.title">Welcome, Java Hipster!</Translate>
            </h2>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
