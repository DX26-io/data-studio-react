import React, { useState, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Button, Flex, Text, TextField, Form } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { savePassword, reset } from './password.reducer';
import SecondaryHeader from 'app/shared/layout/secondary-header/secondary-header';
import { isValid, isPasswordNull, isPasswordMinLengthValid, isPasswordMaxLengthValid, isPasswordEqual } from '../password.util';
import ValidationError from 'app/shared/components/validation-error';
import Alert from '@spectrum-icons/workflow/Alert';

export interface IUserPasswordProps extends StateProps, DispatchProps {}

export const PasswordPage = (props: IUserPasswordProps) => {
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    props.reset();
    props.getSession();
    return () => {
      props.reset();
    };
  }, []);

  const handleValidSubmit = event => {
    event.preventDefault();
    if (currentPassword && isValid(newPassword, confirmPassword)) {
      props.savePassword(currentPassword, newPassword);
    }
  };

  // const updatePassword = event => setPassword(event.target.value);

  return (
    <div>
      <SecondaryHeader
        breadcrumbItems={[
          { label: translate('home.title'), route: '/' },
          { label: translate('account.title'), route: '/account' },
          { label: translate('account.password.title'), route: '/account/password' },
        ]}
        title={translate('account.password.title')}
      ></SecondaryHeader>

      <Flex alignItems="center" justifyContent="center" marginX="size-300" marginTop="size-500">
        <Form width="size-4600"  isQuiet onSubmit={handleValidSubmit}>
          <TextField
            width="100%"
            marginBottom="size-300"
            label={translate('global.form.currentpassword.label')}
            placeholder={translate('global.form.currentpassword.placeholder')}
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
            validationState={currentPassword ? 'valid' : 'invalid'}
          />
          {isPasswordNull(currentPassword) && <ValidationError contentKey="global.messages.validate.currentPassword.required" />}
          <TextField
            width="100%"
            marginBottom="size-300"
            label={translate('global.form.newpassword.label')}
            placeholder={translate('global.form.newpassword.placeholder')}
            validationState={
              !isPasswordNull(newPassword) && !isPasswordMinLengthValid(newPassword) && !isPasswordMaxLengthValid(newPassword)
                ? 'valid'
                : 'invalid'
            }
            type="password"
            value={newPassword}
            onChange={event => {
              setNewPassword(event);
              setPassword(event);
            }}
          />
          {isPasswordNull(newPassword) && <ValidationError contentKey="global.messages.validate.newpassword.required" />}
          {isPasswordMinLengthValid(newPassword) && <ValidationError contentKey="global.messages.validate.newpassword.minlength" />}
          {isPasswordMaxLengthValid(newPassword) && <ValidationError contentKey="global.messages.validate.newpassword.maxlength" />}
          <PasswordStrengthBar password={password} />
          <TextField
            width="100%"
            marginBottom="size-300"
            label={translate('global.form.confirmpassword.label')}
            placeholder={translate('global.form.confirmpassword.placeholder')}
            type="password"
            value={confirmPassword}
            onChange={event => {
              setConfirmPassword(event);
              setPassword(event);
            }}
            validationState={
              !isPasswordNull(confirmPassword) && !isPasswordMinLengthValid(confirmPassword) && !isPasswordMaxLengthValid(confirmPassword) && !isPasswordEqual(newPassword, confirmPassword) 
                ? 'valid'
                : 'invalid'
            }
          />
          {newPassword && isPasswordNull(confirmPassword) && (
            <ValidationError contentKey="global.messages.validate.confirmpassword.required" />
          )}
          {newPassword && isPasswordMinLengthValid(confirmPassword) && (
            <ValidationError contentKey="global.messages.validate.confirmpassword.minlength" />
          )}
          {newPassword && isPasswordMaxLengthValid(confirmPassword) && (
            <ValidationError contentKey="global.messages.validate.confirmpassword.maxlength" />
          )}
          {isPasswordEqual(newPassword, confirmPassword) && <ValidationError contentKey="global.messages.error.dontmatch" />}
          {props.errorMessage && (
            <Flex gap="size-100">
              <Alert color="negative" />
              <Text marginBottom="size-300">
                <span className="spectrum-Body-emphasis error-message">{props.errorMessage}</span>
              </Text>
            </Flex>
          )}
          <Flex marginTop="size-100" alignItems="center" justifyContent="center" direction="row-reverse">
            <Button
              variant="cta"
              marginStart="auto"
              type="submit"
              isDisabled={!currentPassword && !isValid(newPassword, confirmPassword)}
            >
              <Translate contentKey="password.form.button">Save</Translate>
            </Button>
          </Flex>
        </Form>
      </Flex>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated,
  errorMessage: authentication.errorMessage,
});

const mapDispatchToProps = { getSession, savePassword, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PasswordPage);
