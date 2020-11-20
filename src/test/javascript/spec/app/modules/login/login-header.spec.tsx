import React from 'react';
import { shallow } from 'enzyme';
import LoginHeader from 'app/modules/login/login-header';

describe('Login Top Text', () => {
  let mountedWrapper;

  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<LoginHeader />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders Login Top Text', () => {
    const component = wrapper();
    expect(component).toMatchSnapshot();
  });
});
