import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate, getUrlParameter } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';
import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { TextField, Form, Button, Flex, View } from '@adobe/react-spectrum';
import { isValid, isPasswordNull, isPasswordMinLengthValid, isPasswordMaxLengthValid, isPasswordEqual } from '../../password.util';
import ValidationError from 'app/shared/components/validation-error';
import PasswordResetSuccess from './password-reset-success';

export interface IPasswordResetFinishProps extends StateProps, DispatchProps, RouteComponentProps<{ key: string }> {}

export const PasswordResetFinishPage = (props: IPasswordResetFinishProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [key] = useState(getUrlParameter('key', props.location.search));

  useEffect(
    () => () => {
      props.reset();
    },
    []
  );

  const handleValidSubmit = event => {
    if (isValid(newPassword, confirmPassword)) {
      props.handlePasswordResetFinish(key, newPassword);
    }
  };

  // useEffect(() => {
  //   if (props.resetPasswordFinishSuccess) {
  //   }
  // }, [props.resetPasswordFinishSuccess]);

  const getResetForm = () => {
    return (
      <Form data-testid="password-reset-form" width={'60%'} marginStart={'20%'} marginEnd={'20%'}>
        <TextField
          type="password"
          value={newPassword}
          label={translate('global.form.newpassword.label')}
          placeholder={translate('global.form.newpassword.placeholder')}
          onChange={setNewPassword}
          autoFocus
          isRequired
          isQuiet
        />
        {isPasswordNull(newPassword) && <ValidationError contentKey="global.messages.validate.newpassword.required" />}
        {isPasswordMinLengthValid(newPassword) && <ValidationError contentKey="global.messages.validate.newpassword.minlength" />}
        {isPasswordMaxLengthValid(newPassword) && <ValidationError contentKey="global.messages.validate.newpassword.maxlength" />}
        <PasswordStrengthBar password={newPassword} />
        <TextField
          type="password"
          value={confirmPassword}
          label={translate('global.form.confirmpassword.label')}
          placeholder={translate('global.form.confirmpassword.placeholder')}
          onChange={event => {
            setConfirmPassword(event);
          }}
          autoFocus
          isRequired
          isQuiet
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
        <Flex direction="row" alignItems="center" justifyContent="center">
          <Button variant="cta" onPress={handleValidSubmit} marginTop="size-200" width={'20%'}>
            <Translate contentKey="global.form.changePassword">Change Password</Translate>
          </Button>
        </Flex>
      </Form>
    );
  };

  return (
    <View backgroundColor="default" height={'100vh'}>
      <Flex direction="row" alignItems="center" justifyContent="center">
        <span className="spectrum-Heading spectrum-Heading--sizeXXL">
          <Translate contentKey="reset.finish.title">Reset password</Translate>
        </span>
      </Flex>
      {props.resetPasswordFinishSuccess ? <PasswordResetSuccess /> : <div>{key ? getResetForm() : null}</div>}
    </View>
  );
};

const mapStateToProps = storeState => ({
  resetPasswordFinishSuccess: storeState.passwordReset.resetPasswordFinishSuccess,
});

const mapDispatchToProps = { handlePasswordResetFinish, reset };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetFinishPage);
