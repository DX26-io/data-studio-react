import React from 'react';
import { shallow } from 'enzyme';
import { Text } from '@adobe/react-spectrum';
import DataStudioAvatar from 'app/shared/layout/header/partials/DataStudioAvatar';
import { Translate } from 'react-jhipster';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}));

describe('Data studio Avatar test', () => {
  let mountedWrapper;

  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<DataStudioAvatar />);
    }
    return mountedWrapper;
  };

  const simulateClick = () => {
    wrapper().find('button').simulate('click');
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render component as expected', function() {
    expect(wrapper()).toMatchSnapshot();
  });

  it('should contain user greeting', function() {
    simulateClick();
    const userGreetingText = wrapper().find('span').closest(Text);
    expect(userGreetingText.text()).toEqual('userName 12');
    expect(userGreetingText.find(Translate).text()).toEqual('Hello 12');
  });
});
