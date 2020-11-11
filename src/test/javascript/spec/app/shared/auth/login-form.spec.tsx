import React from 'react';
import LoginForm from 'app/modules/login/login-form';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Login Form', () => {
  let mountedWrapper;
  const username = 'test';
  const password = 'test';
  const rememberme = 'true';

  const defaultProps = {
    handleLogin: jest.fn(),
    loginError: false,
  };

  const wrapper = (props = defaultProps) => {
    if (!mountedWrapper) {
      mountedWrapper = render(<LoginForm {...props} />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders login form with default Props', () => {
    const tree = wrapper();
    expect(tree.getByTestId('login-form')).toBeDefined();
    expect(tree.getByTestId('username')).toBeDefined();
    expect(tree.getByTestId('password')).toBeDefined();
    expect(tree.getByTestId('rememberme')).toBeDefined();
    expect(tree.getByTestId('login-action')).toBeDefined();
  });

  it('on change username', () => {
    const tree = wrapper();
    const element = tree.getByTestId('username');
    userEvent.click(element);
    userEvent.type(document.activeElement, username);
    expect(element.value).toBe(username);
  });

  it('on change password', () => {
    const tree = wrapper();
    const element = tree.getByTestId('password');
    userEvent.click(element);
    userEvent.type(document.activeElement, password);
    expect(element.value).toBe(password);
  });

  it('on change rememberme', () => {
    const tree = wrapper();
    const element = tree.getByTestId('rememberme');
    userEvent.click(element);
    userEvent.type(document.activeElement, rememberme);
    expect(element.value).toBe(rememberme);
  });

  it('on form submit', () => {
    const tree = wrapper();
    const elementUserName = tree.getByTestId('username');
    userEvent.click(elementUserName);
    userEvent.type(document.activeElement, username);
    const elementPassword = tree.getByTestId('password');
    userEvent.click(elementPassword);
    userEvent.type(document.activeElement, password);
    const elementRememberme = tree.getByTestId('rememberme');
    userEvent.click(elementRememberme);
    userEvent.type(document.activeElement, rememberme);
    userEvent.click(tree.getByTestId('submit'));
    expect(defaultProps.handleLogin.mock.calls.length).toEqual(1);
  });
});
