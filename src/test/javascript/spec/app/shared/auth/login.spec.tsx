import React from 'react';
import { Login, ILoginProps } from 'app/modules/login/login';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Login Container', () => {
  let mountedWrapper;

  const defaultProps = {
    login: jest.fn(),
    getSession: jest.fn(),
  };

  const wrapper = (props: ILoginProps) => {
    if (!mountedWrapper) {
      mountedWrapper = render(<Login {...defaultProps} {...props} />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders login container with default Props', () => {
    const component = wrapper(null);
    expect(component).toBeDefined();
  });

  it('login callback ', () => {
    const component = wrapper(null);
    userEvent.click(component.getByTestId('submit'));
    expect(defaultProps.login.mock.calls.length).toEqual(1);
    expect(defaultProps.getSession.mock.calls.length).toEqual(0);
  });
});
