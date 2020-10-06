import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { login } from 'app/shared/reducers/authentication';
import LoginModal from './login-modal';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<{}> { }

export const Login = (props: ILoginProps) => {
  const [showModal, setShowModal] = useState(props.showModal);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleLogin = (username, password, rememberMe = false) => props.login(username, password, rememberMe);

  const handleClose = () => {
    setShowModal(false);
    props.history.push('/');
  };


  const { location, isAuthenticated } = props;
  const { from } = (location.state as any) || { from: { pathname: '/', search: location.search } };
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>

        <Grid item xs={12} sm={6}>
          {/* <Paper className={classes.paper}></Paper> */}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <form className={classes.root} noValidate autoComplete="off">
              <div>
                <TextField id="user" label="Email Address" required />
              </div>
              <div>
                <TextField id="password" label="Password" type="password" required />
              </div>
              <div>

                <Grid container spacing={1}>

                  <Grid item xs={12} sm={6}>
                    <Button href="#text-buttons" color="primary" className="text-left">
                      Sign in using SSO
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button variant="contained" color="primary" disableElevation>
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  loginError: authentication.loginError,
  showModal: authentication.showModalLogin,
});

const mapDispatchToProps = { login };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Login);
