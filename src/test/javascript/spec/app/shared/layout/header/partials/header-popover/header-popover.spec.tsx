import React from 'react';
import { shallow } from 'enzyme';
import HeaderPopover from 'app/shared/layout/header/partials/header-popover';

describe('Header popover tests', () => {
  const headerPopoverProps = {
    icon: `<i class='sample-icon' />`,
  };
  let mountedWrapper;

  const wrapper = (props = headerPopoverProps) => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<HeaderPopover {...props}>child component</HeaderPopover>);
    }
    return mountedWrapper;
  };
  const component = wrapper();

  const simulateClick = () => {
    component.find('button').simulate('click');
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render component', function () {
    expect(component).toMatchSnapshot();
  });

  it('should not render popover container with the initial component load', function () {
    expect(component.find('.header-popover-dropdown-container').length).toEqual(0);
  });

  it('should open dropdown and contain passed children', function () {
    simulateClick();
    expect(component.find('.header-popover-dropdown-container').length).toEqual(1);
    expect(component.find('.header-popover-dropdown-container').text()).toEqual('child component');
  });
});
