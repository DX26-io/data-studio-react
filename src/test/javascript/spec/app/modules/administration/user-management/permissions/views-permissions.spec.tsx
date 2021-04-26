import React from 'react';
import { ViewsPermissions, IViewsPermissionsProps } from 'app/modules/administration/user-management/permissions/dashboards/views-permissions';
import userEvent from '@testing-library/user-event';
import { DialogContainer, defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';



export const getInitialState = () => {
  return {
    permissions: {
      viewsPermissions: [],
      totalViewsPermissions: 0,
      updating: false,
      updateSuccess: false,
    },
  };
};

describe('View Permissions dialog', () => {
  let mountedWrapper;

  const mockStore = configureMockStore([thunk, promiseMiddleware]);
  const store = mockStore(getInitialState());
  const routeProps = { history: { push: jest.fn() } as any, location: { } as any };
  const viewsPermissionsProps = {
    setOpen: jest.fn(),
    group: 'role_test',
    user: 'admin',
    id: 111,
    dashboardName: 'test',
    setUpdateSuccess: jest.fn(),
  };

  const receivedProps = {
    getUserViewsPermissions: jest.fn(),
    getUserGroupViewsPermissions: jest.fn(),
    updateUserGroupPermissions: jest.fn(),
    updateUserPermissions: jest.fn(),
    resetViewsPermissions: jest.fn(),
    updating: false,
    updateSuccess: false,
    totalViewsPermissions: 1,
    viewsPermissions: [
      {
        grantee: {
          createdBy: 'system',
          createdDate: '2021-02-04T16:18:24.238044+05:30',
          lastModifiedBy: 'system',
          lastModifiedDate: null,
          id: 3,
          login: 'flairadmin',
          firstName: 'Administrator',
          lastName: 'Administrator',
          email: 'flairadmin@localhost',
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
                  resource: '1004',
                  action: 'READ',
                  scope: 'VIEW',
                },
                action: 'READ',
                scope: 'VIEW',
                resource: '1004',
                stringValue: 'READ_1004_VIEW',
              },
              hasIt: true,
            },
            {
              permission: {
                key: {
                  resource: '1004',
                  action: 'WRITE',
                  scope: 'VIEW',
                },
                action: 'WRITE',
                scope: 'VIEW',
                resource: '1004',
                stringValue: 'WRITE_1004_VIEW',
              },
              hasIt: true,
            },
            {
              permission: {
                key: {
                  resource: '1004',
                  action: 'UPDATE',
                  scope: 'VIEW',
                },
                action: 'UPDATE',
                scope: 'VIEW',
                resource: '1004',
                stringValue: 'UPDATE_1004_VIEW',
              },
              hasIt: true,
            },
            {
              permission: {
                key: {
                  resource: '1004',
                  action: 'DELETE',
                  scope: 'VIEW',
                },
                action: 'DELETE',
                scope: 'VIEW',
                resource: '1004',
                stringValue: 'DELETE_1004_VIEW',
              },
              hasIt: true,
            },
            {
              permission: {
                key: {
                  resource: '1004',
                  action: 'READ_PUBLISHED',
                  scope: 'VIEW',
                },
                action: 'READ_PUBLISHED',
                scope: 'VIEW',
                resource: '1004',
                stringValue: 'READ-PUBLISHED_1004_VIEW',
              },
              hasIt: true,
            },
            {
              permission: {
                key: {
                  resource: '1004',
                  action: 'DELETE_PUBLISHED',
                  scope: 'VIEW',
                },
                action: 'DELETE_PUBLISHED',
                scope: 'VIEW',
                resource: '1004',
                stringValue: 'DELETE-PUBLISHED_1004_VIEW',
              },
              hasIt: true,
            },
            {
              permission: {
                key: {
                  resource: '1004',
                  action: 'TOGGLE_PUBLISH',
                  scope: 'VIEW',
                },
                action: 'TOGGLE_PUBLISH',
                scope: 'VIEW',
                resource: '1004',
                stringValue: 'TOGGLE-PUBLISH_1004_VIEW',
              },
              hasIt: true,
            },
            {
              permission: {
                key: {
                  resource: '1004',
                  action: 'REQUEST_PUBLISH',
                  scope: 'VIEW',
                },
                action: 'REQUEST_PUBLISH',
                scope: 'VIEW',
                resource: '1004',
                stringValue: 'REQUEST-PUBLISH_1004_VIEW',
              },
              hasIt: true,
            },
            {
              permission: {
                key: {
                  resource: '1004',
                  action: 'MANAGE_PUBLISH',
                  scope: 'VIEW',
                },
                action: 'MANAGE_PUBLISH',
                scope: 'VIEW',
                resource: '1004',
                stringValue: 'MANAGE-PUBLISH_1004_VIEW',
              },
              hasIt: true,
            },
          ],
          viewName: 'view1',
          id: 1004,
        },
      },
    ],
  };
  const wrapper = (props: IViewsPermissionsProps) => {
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
            <DialogContainer
              onDismiss={() => {
                return true;
              }}
            >
              <ViewsPermissions {...receivedProps} permissionProps={routeProps} {...viewsPermissionsProps} {...props} />
            </DialogContainer>
          </Provider>
        </SpectrumProvider>
      );
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render views permissions', () => {
    const tree = wrapper(null);
    expect(tree).toBeDefined();
    expect(receivedProps.getUserViewsPermissions.mock.calls.length).toEqual(1);
  });

  it('on save permissions', () => {
    const tree = wrapper(null);
    const checkboxElement = tree.getByTestId('checkbox-WRITE');
    userEvent.click(checkboxElement);
    userEvent.type(document.activeElement, "false");
    const submitButton = tree.getByTestId('permissions-submit');
    userEvent.click(submitButton);
    expect(receivedProps.updateUserPermissions.mock.calls.length).toEqual(1);
  });

  it('on views permissions dialog close', () => {
    const tree = wrapper(null);
    const cancelButton = tree.getByTestId('permissions-cancel');
    userEvent.click(cancelButton);
    expect(viewsPermissionsProps.setOpen.mock.calls.length).toEqual(1);
  });

});
