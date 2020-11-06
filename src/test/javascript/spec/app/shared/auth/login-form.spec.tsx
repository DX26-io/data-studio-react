import React from 'react';
import { shallow } from 'enzyme';
import { Form, TextField, Checkbox } from '@adobe/react-spectrum';
import LoginForm from 'app/modules/login/login-form';

// TODO : test cases are partially written. onChange username,password,rememberMe and form submission with test data is lef

describe('Login Form', () => {
  let mountedWrapper;

  const defaultProps = {
    handleLogin: jest.fn(),
    loginError: false,
  };

  const wrapper = (props = defaultProps) => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<LoginForm {...props} />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders login form with default Props', () => {
    const component = wrapper();
    expect(component).toMatchSnapshot();
    const form = component.find(Form);
    expect(form.length).toEqual(1);
    const textFields = form.find(TextField);
    expect(textFields.length).toEqual(2);
    const checkbox = form.find(Checkbox);
    expect(checkbox.length).toEqual(1);
  });
});
