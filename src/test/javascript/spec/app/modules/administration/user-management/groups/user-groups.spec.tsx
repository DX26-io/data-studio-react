import React from 'react';
import { UserGroups, IUserGroupsProps } from 'app/modules/administration/user-management/groups/user-groups';
import userEvent from '@testing-library/user-event';
import { defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { MemoryRouter } from 'react-router';

export const getInitialState = () => {
  return {
    userGroups: {
      groups: [],
      totalItems: 0,
      group: { name: 'test', id: 123 },
    },
  };
};

describe('User Management Groups', () => {
  let mountedWrapper;

  const groupsProps = {
    history: { push: jest.fn() } as any,
    location: {} as any,
    match: {} as any,
    totalItems: 2,
    getUserGroups: jest.fn(),
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
  };

  const wrapper = (props: IUserGroupsProps) => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore(getInitialState());
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
            <MemoryRouter>
              <UserGroups {...props} {...groupsProps} />
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

  it('should render groups', () => {
    const tree = wrapper(null);
    expect(tree).toBeDefined();
    expect(groupsProps.getUserGroups.mock.calls.length).toEqual(1);
  });

  it('on group dialog open', () => {
    const tree = wrapper(null);
    const createButton = tree.getByTestId('create-group');
    userEvent.click(createButton);
    const dialog = tree.getByTestId('group-form-dialog');
    expect(dialog).toBeDefined();
  });
});
