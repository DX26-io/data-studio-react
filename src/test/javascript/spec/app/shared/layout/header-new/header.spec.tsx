import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Header from 'app/shared/layout/header/header';

describe('Header tests', () => {
  const localeSpy = sinon.spy();
  const devProps = {
    isAuthenticated: true,
    isAdmin: true,
    currentLocale: 'en',
    onLocaleChange: localeSpy,
    ribbonEnv: 'dev',
    isInProduction: false,
    isSwaggerEnabled: true
  };
  let mountedWrapper;

  const wrapper = (props = devProps) => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<Header {...props} />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render header component and have HTML header tag', () => {
    const component = wrapper();
    expect(component).toMatchSnapshot();
    expect(component.find('header').length).toEqual(1);
  });

});
