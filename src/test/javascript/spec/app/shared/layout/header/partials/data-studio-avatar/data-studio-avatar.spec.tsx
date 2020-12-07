import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import DataStudioAvatar from 'app/shared/layout/header/partials/data-studio-avatar';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as SpectrumProvider } from '@react-spectrum/provider';
import { defaultTheme } from '@adobe/react-spectrum';
import '@testing-library/jest-dom';

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

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
            <DataStudioAvatar />
          </Provider>
        </SpectrumProvider>
      );
    }
    return mountedWrapper;
  };

  const clickOnAvatarButton = tree => {
    const avatarButton = tree.getByTestId('avatarButton');
    userEvent.click(avatarButton);
  };

  it('should render component as expected', function () {
    const tree = wrapper();
    clickOnAvatarButton(tree);
    expect(tree.getByTestId('userGreeting')).toBeDefined();
    expect(tree.getByTestId('preferencesButton')).toBeDefined();
    expect(tree.getByTestId('logoutButton')).toBeDefined();
  });

  it('should render user name correctly', function () {
    const tree = wrapper();
    clickOnAvatarButton(tree);
    expect(tree.getByTestId('userGreeting')).toHaveTextContent('userName');
  });
});
