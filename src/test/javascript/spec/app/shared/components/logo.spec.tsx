import React from 'react';
import { shallow } from 'enzyme';
import Logo from 'app/shared/components/logo/logo';

describe('Logo tests', () => {
  let mountedWrapper;
  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<Logo />);
    }
    return mountedWrapper;
  };

  it('should render component as expected', function () {
    expect(wrapper()).toMatchSnapshot();
  });
});
