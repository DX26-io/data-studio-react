import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import DataStudioAvatar from 'app/shared/layout/header/partials/DataStudioAvatar';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('Data studio Avatar test', () => {
  let mountedWrapper;
  const initialState = {
    authentication: {
      account: {
        login: 'userName',
      },
    },
  };
  const mockStore = configureStore();
  const store = mockStore(initialState);

  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = mount(
        <Provider store={store}>
          <DataStudioAvatar />
        </Provider>
      );
    }
    return mountedWrapper;
  };

  const simulateClick = () => {
    wrapper().find('button').simulate('click');
  };

  it('should render component as expected', function () {
    simulateClick();
    expect(wrapper()).toMatchSnapshot();
  });
});
