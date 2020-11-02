import React from 'react';
import { mount } from 'enzyme';
import Notifications from 'app/shared/layout/header/partials/Notifications';

describe('Notifications test', () => {
  let mountedWrapper;
  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = mount(<Notifications />);
    }
    return mountedWrapper;
  };

  const simulateClick = () => {
    wrapper().find('button').simulate('click');
  };

  it('should render as expected', function () {
    simulateClick();
    expect(wrapper()).toMatchSnapshot();
  });
});
