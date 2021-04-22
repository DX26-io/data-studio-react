import React from 'react';
import { UsersGroups,IUsersGroupsProps } from 'app/modules/administration/user-management/permission/users-groups';
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
    userGroups: { groups: [] },
    userManagement: { users: [] },
  };
};

describe('Users Groups', () => {
  let mountedWrapper;

  const permissionsProps = {
    history: { push: jest.fn() } as any,
    location: {} as any,
    match: {} as any
  };

  const receivedProps = {
    getUserGroups: jest.fn(),
    getUsers: jest.fn(),
    searchUsers: jest.fn(),
    searchUserGroups:jest.fn(),
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
      ]
  }

  const wrapper = (props : IUsersGroupsProps) => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore(getInitialState());
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
            <MemoryRouter>
              <UsersGroups {...receivedProps} {...permissionsProps} {...props}/>
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

  it('should render Users Groups', () => {
    const tree = wrapper(null);
    expect(tree).toBeDefined();
    expect(receivedProps.getUserGroups.mock.calls.length).toEqual(1);
    expect(receivedProps.getUsers.mock.calls.length).toEqual(1);
  });

  it('on search user', () => {
    const tree = wrapper(null);
    const searchElement = tree.getByTestId('search');
    userEvent.click(searchElement);
    userEvent.type(document.activeElement, "t");
    expect(receivedProps.searchUsers.mock.calls.length).toEqual(2);
  });

  // TODO : need to find a way to test on change tab and list items

});
