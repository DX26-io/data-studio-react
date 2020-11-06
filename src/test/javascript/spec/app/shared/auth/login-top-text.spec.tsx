import React from 'react';
import { shallow } from 'enzyme';
import Typography from '@material-ui/core/Typography';
import LoginTopText from 'app/modules/login/login-top-text';

describe('Login Top Text', () => {
  let mountedWrapper;

  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<LoginTopText />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders Login Top Text', () => {
    const component = wrapper();
    expect(component).toMatchSnapshot();
    const typography = component.find(Typography);
    expect(typography.length).toEqual(1);
  });

});
