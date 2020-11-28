import React from 'react';
import LoginForm from 'app/modules/login/login-form';
import userEvent from '@testing-library/user-event';
import { defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import { render } from '@testing-library/react';

const username = 'test';
const password = 'test';

export const fillUsernamePasswordAndSubmit = tree => {
  const usernameElement = tree.getByTestId('username');
  userEvent.click(usernameElement);
  userEvent.type(document.activeElement, username);
  const passwordElement = tree.getByTestId('password');
  userEvent.click(passwordElement);
  userEvent.type(document.activeElement, password);
  const submitButton = tree.getByTestId('submit');
  userEvent.click(submitButton);
};

describe('Login Form', () => {
  let mountedWrapper;

  const defaultProps = {
    handleLogin: jest.fn(),
    loginError: false,
  };

  const wrapper = (props = defaultProps) => {
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <LoginForm {...props} />
        </SpectrumProvider>
      );
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render login form', () => {
    const tree = wrapper();
    expect(tree.getByTestId('login-form')).toBeDefined();
    expect(tree.getByTestId('username')).toBeDefined();
    expect(tree.getByTestId('password')).toBeDefined();
    expect(tree.getByTestId('remember-me')).toBeDefined();
    expect(tree.getByTestId('login-action')).toBeDefined();
  });

  it('on form submit', () => {
    const tree = wrapper();
    fillUsernamePasswordAndSubmit(tree);
    expect(defaultProps.handleLogin.mock.calls.length).toEqual(1);
  });

  it('should show error when submitted without username and password', () => {
    const tree = wrapper();
    const submitButton = tree.getByTestId('submit');
    userEvent.click(submitButton);
    const emptyError = tree.getByTestId('empty-error');
    expect(emptyError).toBeDefined();
  });

  it('should not show error when submitted with username and password', () => {
    const tree = wrapper();
    fillUsernamePasswordAndSubmit(tree);
    expect(tree.queryByTestId('empty-error')).toBeNull();
  });

  it('should show login error with wrong credentials', () => {
    const defaultPropsWithLoginError = {
      ...defaultProps,
      loginError: true,
    };
    const tree = render(
      <SpectrumProvider theme={defaultTheme}>
        <LoginForm {...defaultPropsWithLoginError} />
      </SpectrumProvider>
    );
    const loginError = tree.getByTestId('login-error');
    expect(loginError).toBeDefined();
  });
});
