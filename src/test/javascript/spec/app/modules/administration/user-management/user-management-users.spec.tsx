import React from 'react';
import { UserManagementUsers, IUserManagementProps } from 'app/modules/administration/user-management/users/user-management-users';
import userEvent from '@testing-library/user-event';
import { DialogContainer, defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import { render } from '@testing-library/react';
import { AUTHORITIES } from 'app/config/constants';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { shallow, mount } from 'enzyme';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import { MemoryRouter } from 'react-router';
import { screen } from '@testing-library/dom';

export const getInitialState = () => {
  return {
    userManagement: {
      users: [],
      totalItems: 0,
    },
  };
};

describe('User Management Users', () => {
  let mountedWrapper;

  const userManagementUsersProps = {
    history: { push: jest.fn() } as any,
    location: {} as any,
    match: {} as any,
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
    totalItems: 2,
    getUsers: jest.fn(),
  };

  const wrapper = (props: IUserManagementProps) => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore(getInitialState());
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
            <MemoryRouter>
              <UserManagementUsers {...props} {...userManagementUsersProps} />
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

  it('should render users', () => {
    const tree = wrapper(null);
    expect(tree).toBeDefined();
    expect(userManagementUsersProps.getUsers.mock.calls.length).toEqual(1);
  });

  it('on user dialog open', () => {
    const tree = wrapper(null);
    const createButton = tree.getByTestId('create-user');
    userEvent.click(createButton);
    const dialog = tree.getByTestId('user-form-dialog');
    expect(dialog).toBeDefined();
    // expect(1).toEqual(1);
  });
});
