import React from 'react';
import { DashboardPermissionContainer } from 'app/modules/administration/user-management/permission/dashboard-permissions-container';
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

// export interface DashboardPermissionContainerProps extends  RouteComponentProps<{}> {
//   // history: { push: jest.fn() } as any,
//   // location: {} as any,
// }

describe('Dashboard Permission Container', () => {
  let mountedWrapper;

  const permissionsProps = {
    history: { push: jest.fn() } as any,
    location: {} as any,
    match: {} as any,
    groups: [
      {
        id: '123',
        name: 'test123',
      },
      {
        id: '1234',
        name: 'test1234',
      },
    ],
    users: [
      {
        id: '123',
        login: 'test1',
        firstName: 'test1',
        lastName: 'test1',
        email: 'test1@dx26.com',
        activated: true,
        userGroups: [AUTHORITIES.ADMIN],
        userType: 'xyz',
      },
      {
        id: '113',
        login: 'test2',
        firstName: 'test2',
        lastName: 'test2',
        email: 'test2@dx26.com',
        activated: true,
        userGroups: [AUTHORITIES.ADMIN],
        userType: 'xyz',
      },
    ],
    dashboardPermissions: [
      {
        grantee: {
          createdBy: 'system',
          createdDate: '2021-01-28T09:50:04.986446+05:30',
          lastModifiedBy: 'system',
          lastModifiedDate: null,
          id: 4,
          login: 'flairdev',
          firstName: 'Developer',
          lastName: 'Developer',
          email: 'flairdev@localhost',
          activated: true,
          langKey: 'en',
          resetKey: null,
          resetDate: null,
          userType: 'internal',
          realm: {
            id: 1,
            name: 'vizcentric',
          },
        },
        info: {
          permissionMetadata: [
            {
              permission: {
                key: {
                  resource: '1002',
                  action: 'READ',
                  scope: 'DASHBOARD',
                },
                action: 'READ',
                scope: 'DASHBOARD',
                resource: '1002',
                stringValue: 'READ_1002_DASHBOARD',
              },
              hasIt: false,
              status: 'allow',
            },
            {
              permission: {
                key: {
                  resource: '1002',
                  action: 'WRITE',
                  scope: 'DASHBOARD',
                },
                action: 'WRITE',
                scope: 'DASHBOARD',
                resource: '1002',
                stringValue: 'WRITE_1002_DASHBOARD',
              },
              hasIt: false,
              status: 'deny',
            },
            {
              permission: {
                key: {
                  resource: '1002',
                  action: 'UPDATE',
                  scope: 'DASHBOARD',
                },
                action: 'UPDATE',
                scope: 'DASHBOARD',
                resource: '1002',
                stringValue: 'UPDATE_1002_DASHBOARD',
              },
              hasIt: false,
              status: 'allow',
            },
            {
              permission: {
                key: {
                  resource: '1002',
                  action: 'DELETE',
                  scope: 'DASHBOARD',
                },
                action: 'DELETE',
                scope: 'DASHBOARD',
                resource: '1002',
                stringValue: 'DELETE_1002_DASHBOARD',
              },
              hasIt: false,
              status: 'partial',
            },
            {
              permission: {
                key: {
                  resource: '1002',
                  action: 'READ_PUBLISHED',
                  scope: 'DASHBOARD',
                },
                action: 'READ_PUBLISHED',
                scope: 'DASHBOARD',
                resource: '1002',
                stringValue: 'READ-PUBLISHED_1002_DASHBOARD',
              },
              hasIt: false,
              status: 'deny',
            },
            {
              permission: {
                key: {
                  resource: '1002',
                  action: 'DELETE_PUBLISHED',
                  scope: 'DASHBOARD',
                },
                action: 'DELETE_PUBLISHED',
                scope: 'DASHBOARD',
                resource: '1002',
                stringValue: 'DELETE-PUBLISHED_1002_DASHBOARD',
              },
              hasIt: false,
              status: 'deny',
            },
            {
              permission: {
                key: {
                  resource: '1002',
                  action: 'TOGGLE_PUBLISH',
                  scope: 'DASHBOARD',
                },
                action: 'TOGGLE_PUBLISH',
                scope: 'DASHBOARD',
                resource: '1002',
                stringValue: 'TOGGLE-PUBLISH_1002_DASHBOARD',
              },
              hasIt: false,
              status: 'deny',
            },
            {
              permission: {
                key: {
                  resource: '1002',
                  action: 'REQUEST_PUBLISH',
                  scope: 'DASHBOARD',
                },
                action: 'REQUEST_PUBLISH',
                scope: 'DASHBOARD',
                resource: '1002',
                stringValue: 'REQUEST-PUBLISH_1002_DASHBOARD',
              },
              hasIt: false,
              status: 'deny',
            },
            {
              permission: {
                key: {
                  resource: '1002',
                  action: 'MANAGE_PUBLISH',
                  scope: 'DASHBOARD',
                },
                action: 'MANAGE_PUBLISH',
                scope: 'DASHBOARD',
                resource: '1002',
                stringValue: 'MANAGE-PUBLISH_1002_DASHBOARD',
              },
              hasIt: false,
              status: 'deny',
            },
          ],
          id: 1002,
          dashboardName: 'ecomm',
        },
      },
    ],
    totalDashboardPermissions:1
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
