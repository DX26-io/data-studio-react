import React from 'react';
import UserGroupUpdate from 'app/modules/administration/user-management/groups/user-group-update';
import userEvent from '@testing-library/user-event';
import { DialogContainer, defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

export const getUserGroup = (isNew: boolean) => {
  return {
    id: isNew ? '' : '123',
    name: 'test123',
  };
};

export const getInitialState = (isNew: boolean) => {
  return {
    userGroups: {
      group: getUserGroup(isNew),
      loading: false,
      updating: false,
      fetchSuccess: true,
      updateSuccess: true,
    },
  };
};

export const fillUserManagementForm = (tree, isNew) => {
  const group = getUserGroup(isNew);
  const nameElement = tree.getByTestId('name');
  userEvent.click(nameElement);
  userEvent.type(document.activeElement, group.name);
  const submitButton = tree.getByTestId('group-form-submit');
  userEvent.click(submitButton);
};

describe('User Management dialog', () => {
  let mountedWrapper;

  const wrapper = (isNew, defaultProps) => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore(getInitialState(isNew));
    const historyProps = { history: { push: jest.fn() } as any };
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
            <DialogContainer
              onDismiss={() => {
                return true;
              }}
            >
              <UserGroupUpdate {...defaultProps} {...historyProps} />
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

  it('should render group dialog', () => {
    const defaultProps = {
      isNew: true,
      setOpen: jest.fn(),
      groupName: 'test',
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(true, defaultProps);
    expect(tree.getByTestId('group-form-dialog')).toBeDefined();
    expect(tree.getByTestId('group-form-heading')).toBeDefined();
    expect(tree.getByTestId('group-form-action')).toBeDefined();
    expect(tree.getByTestId('group-form')).toBeDefined();
  });

  it('on group create', () => {
    const defaultProps = {
      isNew: true,
      setOpen: jest.fn(),
      groupName: '',
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(true, defaultProps);
    fillUserManagementForm(tree, true);
    expect(defaultProps.setUpdateSuccess.mock.calls.length).toEqual(1);
  });

  it('on group update', () => {
    const defaultProps = {
      isNew: false,
      setOpen: jest.fn(),
      groupName: 'test123',
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(false, defaultProps);
    fillUserManagementForm(tree, false);
    expect(defaultProps.setUpdateSuccess.mock.calls.length).toEqual(1);
  });

  it('on group delete', () => {
    const defaultProps = {
      isNew: false,
      setOpen: jest.fn(),
      groupName: 'test123',
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(false, defaultProps);
    const deleteButton = tree.getByTestId('delete');
    userEvent.click(deleteButton);
    expect(defaultProps.setUpdateSuccess.mock.calls.length).toEqual(1);
  });

  it('should show error when submitted without group name', () => {
    const defaultProps = {
      isNew: true,
      setOpen: jest.fn(),
      groupName: '',
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(true, defaultProps);
    const submitButton = tree.getByTestId('group-form-submit');
    userEvent.click(submitButton);
    expect(tree.getByTestId('validation-error')).toBeDefined();
  });

  it('on group dialog close', () => {
    const defaultProps = {
      isNew: true,
      setOpen: jest.fn(),
      groupName: '',
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(true, defaultProps);
    const cancelButton = tree.getByTestId('group-form-cancel');
    userEvent.click(cancelButton);
    expect(defaultProps.setOpen.mock.calls.length).toEqual(2);
  });

  it('on redirect to permission page', () => {
    const defaultProps = {
      isNew: true,
      setOpen: jest.fn(),
      groupName: '',
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(true, defaultProps);
    const cancelButton = tree.getByTestId('redirect');
    userEvent.click(cancelButton);
    expect(defaultProps.setOpen.mock.calls.length).toEqual(2);
  });
});
