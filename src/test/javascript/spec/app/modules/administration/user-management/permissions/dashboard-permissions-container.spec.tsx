import React from 'react';
import { DashboardPermissionContainer } from 'app/modules/administration/user-management/permissions/dashboards/dashboard-permissions-container';
import userEvent from '@testing-library/user-event';
import { defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { MemoryRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { AUTHORITIES } from 'app/config/constants';

export const getInitialState = () => {
  return {
    permissions: {
      dashboardPermissions: [],
      totalDashboardPermissions: 0,
    },
    userGroups: { groups: [] },
    userManagement: { users: [] },
  };
};

describe('Dashboard Permission Container', () => {
  let mountedWrapper;

  const permissionsProps = {
    history: { push: jest.fn() } as any,
    location: {} as any,
    match: {} as any,
    dashboardPermissions:[],
    totalDashboardPermissions:0
  };

  const wrapper = () => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore(getInitialState());
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
            <MemoryRouter>
              <DashboardPermissionContainer {...permissionsProps} />
            </MemoryRouter>
          </Provider>
        </SpectrumProvider>
      );
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render Dashboard Permission Container', () => {
    const tree = wrapper();
    expect(tree).toBeDefined();
  });
});
