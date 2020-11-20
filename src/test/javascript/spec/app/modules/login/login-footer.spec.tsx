import React from 'react';
import { shallow } from 'enzyme';
import { Text } from '@adobe/react-spectrum';
import LoginFooter from 'app/modules/login/login-footer';

describe('Login Footer', () => {
  let mountedWrapper;

  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<LoginFooter />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders Login Footer', () => {
    const component = wrapper();
    expect(component).toMatchSnapshot();
    const text = component.find(Text);
    expect(text.length).toEqual(1);
  });
});
