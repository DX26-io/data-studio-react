import React from 'react';
import { shallow } from 'enzyme';
import { Grid, View } from '@adobe/react-spectrum';
import { Login, ILoginProps } from 'app/modules/login/login';

// TODO : test cases are partially written.call back of login needs to be tested

describe('Login Container', () => {
  let mountedWrapper;

  const wrapper = (props: ILoginProps) => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<Login {...props} />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders login container with default Props', () => {
    const component = wrapper(null);
    expect(component).toMatchSnapshot();
    const grid = component.find(Grid);
    expect(grid.length).toEqual(1);
    const views = grid.find(View);
    expect(views.length).toEqual(2);
  });
});
