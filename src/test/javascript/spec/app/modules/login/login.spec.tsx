import React from 'react';
import { ILoginProps, Login } from 'app/modules/login/login';
import { render } from '@testing-library/react';
import { defaultTheme } from '@adobe/react-spectrum';
import { Provider as SpectrumProvider } from '@react-spectrum/provider';
import { fillUsernamePasswordAndSubmit } from './login-form.spec';

describe('Login Container', () => {
  let mountedWrapper;

  const defaultProps = {
    login: jest.fn(),
  };

  const wrapper = (props: ILoginProps) => {
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Login {...defaultProps} {...props} />)
        </SpectrumProvider>
      );
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders login container with default Props', () => {
    const component = wrapper(null);
    expect(component.getByTestId('login-container')).toBeDefined();
  });

  it('login callback ', () => {
    const tree = wrapper(null);
    fillUsernamePasswordAndSubmit(tree);
    expect(defaultProps.login.mock.calls.length).toEqual(1);
  });
});
