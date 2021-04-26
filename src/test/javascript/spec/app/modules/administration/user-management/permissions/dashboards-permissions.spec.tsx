import React from 'react';
import {
  DashboardsPermissions,
  IDashboardsPermissionsProps,
} from 'app/modules/administration/user-management/permissions/dashboards/dashboards-permissions';
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
      viewsPermissions:[]
    },
  };
};

describe('Dashboards Permissions', () => {
  let mountedWrapper;

  const permissionProps = {
    history: { push: jest.fn() } as any,
    location: { search: '?page=0&user=flairadmin' } as any,
    match: {} as any
  };

  const receivedProps ={
    getUserDashboardPermissions: jest.fn(),
    getUserGroupDashboardPermissions: jest.fn(),
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
      totalDashboardPermissions: 1,
      viewsPermissions:[]
  }

  const wrapper = (props: IDashboardsPermissionsProps) => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore(getInitialState());
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <MemoryRouter>
            <Provider store={store}>
              <DashboardsPermissions {...receivedProps} {...props} permissionProps={permissionProps} />
            </Provider>
          </MemoryRouter>
        </SpectrumProvider>
      );
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render Dashboards Permissions', () => {
    const tree = wrapper(null);
    expect(tree).toBeDefined();
    expect(receivedProps.getUserDashboardPermissions.mock.calls.length).toEqual(1);
  });

  it('on views permissions dialog open', () => {
    const tree = wrapper(null);
    const updatePermissions = tree.getByTestId('update-views-permissions-1002');
    userEvent.click(updatePermissions);
    const dialog = tree.getByTestId('views-permissions-dialog');
    expect(dialog).toBeDefined();
  });

});
