import React from 'react';
import Notifications from 'app/shared/layout/header/partials/notifications';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defaultTheme } from '@adobe/react-spectrum';
import { Provider as SpectrumProvider } from '@react-spectrum/provider';

describe('Notifications test', () => {
  let mountedWrapper;
  const wrapper = () => {
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Notifications />
        </SpectrumProvider>
      );
    }
    return mountedWrapper;
  };

  const clickNotificationsButton = tree => {
    const notificationsButton = tree.getByTestId('notificationsButton');
    userEvent.click(notificationsButton);
  };

  it('should render as expected', function () {
    const tree = wrapper();
    clickNotificationsButton(tree);
    tree.getByTestId('notificationsContainer');
    expect(tree.getByTestId('notificationsContainer')).toBeDefined();
  });
});
