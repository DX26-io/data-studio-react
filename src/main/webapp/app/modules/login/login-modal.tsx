import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './loginmodal.scss';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: Function;
  handleClose: Function;
}

class LoginModal extends React.Component<ILoginModalProps> {
  // handleSubmit = (event, errors, { username, password, rememberMe }) => {
  //   const { handleLogin } = this.props;
  //   handleLogin(username, password, rememberMe);
  // };
  state = {
    formData: {
      email: '',
      password: '',
    },
    submitted: false,
  }

  handleChange = (event) => {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({ formData });
  }

  handleSubmit = () => {
    const { handleLogin } = this.props;
    handleLogin(this.state.formData.email, this.state.formData.password,false);
  }

  render() {
    const { loginError, handleClose } = this.props;
    const { formData, submitted } = this.state;

    return (
      <div className="root">
        <Grid container spacing={1}>

          <Grid item xs={12} sm={12}>
            <Paper></Paper>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper>
              <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmit}
              >
                <div>
                  <TextValidator
                    label="Email Address"
                    onChange={this.handleChange}
                    name="email"
                    value={formData.email}
                    validators={['required', 'isEmail']}
                    errorMessages={['email is required', 'email is not valid']}
                  />
                </div>
                <div>
                  <TextValidator
                    label="Password"
                    onChange={this.handleChange}
                    name="password"
                    value={formData.password}
                    validators={['required']}
                    errorMessages={['password is required']}
                  />
                </div>
                <div>

                  <Grid container spacing={1}>

                    <Grid item >
                      <Button href="#text-buttons" color="primary" className="text-left">
                        Sign in using SSO
            </Button>
                    </Grid>
                    <Grid item >
                      <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        disabled={submitted}
                      >
                        {
                          (submitted && 'Your form is submitted!')
                          || (!submitted && 'Login')
                        }
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </ValidatorForm>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default LoginModal;
