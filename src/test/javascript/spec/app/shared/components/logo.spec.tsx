import React from 'react';
import { mount } from 'enzyme';
import Logo from 'app/shared/components/logo/logo';

describe('Logo tests', () => {
  let mountedWrapper;
  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = mount(<Logo />);
    }
    return mountedWrapper;
  };

  it('should render component as expected', function() {
    expect(wrapper()).toMatchSnapshot();
  });
});
