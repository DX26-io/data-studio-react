import React from 'react';
import UserUpdate from 'app/modules/administration/user-management/users/user-update';
import userEvent from '@testing-library/user-event';
import { DialogContainer, defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import { render } from '@testing-library/react';
import { AUTHORITIES } from 'app/config/constants';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

export const getUser = (isNew: boolean) => {
  return {
    id: isNew ? '' : '123',
    login: 'test123',
    firstName: 'test',
    lastName: 'test',
    email: 'test@dx26.com',
    activated: true,
    userGroups: [AUTHORITIES.ADMIN,AUTHORITIES.SUPER_ADMIN],
  };
};

export const getInitialState = (isNew: boolean) => {
  return {
    userManagement: {
      user: getUser(isNew),
      roles: [AUTHORITIES.ADMIN,AUTHORITIES.SUPER_ADMIN],
      authorities:[AUTHORITIES.ADMIN,AUTHORITIES.SUPER_ADMIN],
      loading: false,
      updating: false,
      fetchSuccess: true,
      updateSuccess: true,
    },
  };
};

export const fillUserManagementForm = (tree, isNew) => {
  const user = getUser(isNew);
  const loginElement = tree.getByTestId('login');
  userEvent.click(loginElement);
  userEvent.type(document.activeElement, user.login);
  const firstNameElement = tree.getByTestId('first-name');
  userEvent.click(firstNameElement);
  userEvent.type(document.activeElement, user.firstName);
  const lastNameElement = tree.getByTestId('last-name');
  userEvent.click(lastNameElement);
  userEvent.type(document.activeElement, user.lastName);
  const emailElement = tree.getByTestId('email');
  userEvent.click(emailElement);
  userEvent.type(document.activeElement, user.email);
  const activatedElement = tree.getByTestId('activated');
  userEvent.click(activatedElement);
  userEvent.type(document.activeElement, user.activated.toString());
  const submitButton = tree.getByTestId('user-form-submit');
  userEvent.click(submitButton);
};

describe('User Management dialog', () => {
  let mountedWrapper;

  const wrapper = (isNew, defaultProps) => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore(getInitialState(isNew));
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
            <DialogContainer
              onDismiss={() => {
                return true;
              }}
            >
              <UserUpdate {...defaultProps} />
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

  it('should render user dialog', () => {
    const defaultProps = {
      setOpen: jest.fn(),
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(true, defaultProps);
    expect(tree.getByTestId('user-form-dialog')).toBeDefined();
    expect(tree.getByTestId('user-form-heading')).toBeDefined();
    expect(tree.getByTestId('user-form-action')).toBeDefined();
    expect(tree.getByTestId('user-form')).toBeDefined();
    expect(tree.getByTestId('login')).toBeDefined();
    expect(tree.getByTestId('email')).toBeDefined();
    expect(tree.getByTestId('activated')).toBeDefined();
    expect(tree.getByTestId('first-name')).toBeDefined();
    expect(tree.getByTestId('last-name')).toBeDefined();
  });

  // commented below test case for time being
  // it('should show error when submitted without email and login', () => {
  //   const defaultProps = {
  //     setOpen: jest.fn(),
  //     setUpdateSuccess: jest.fn(),
  //   };
  //   const tree = wrapper(true, defaultProps);
  //   const loginElement = tree.getByTestId('login');
  //   userEvent.click(loginElement);
  //   userEvent.type(document.activeElement, 'test');
  //   const submitButton = tree.getByTestId('user-form-submit');
  //   userEvent.click(submitButton);
  //   expect(tree.getByTestId('validation-error')).toBeDefined();
  // });

  it('on user create', () => {
    const defaultProps = {
      setOpen: jest.fn(),
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(true, defaultProps);
    fillUserManagementForm(tree, true);
    expect(defaultProps.setUpdateSuccess.mock.calls.length).toEqual(1);
  });

  it('on user update', () => {
    const defaultProps = {
      setOpen: jest.fn(),
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(false, defaultProps);
    fillUserManagementForm(tree, false);
    expect(defaultProps.setUpdateSuccess.mock.calls.length).toEqual(1);
  });

  it('on user delete', () => {
    const defaultProps = {
      setOpen: jest.fn(),
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(false, defaultProps);
    const deleteButton = tree.getByTestId('delete');
    userEvent.click(deleteButton);
    expect(defaultProps.setUpdateSuccess.mock.calls.length).toEqual(1);
  });

  it('on user dialog close', () => {
    const defaultProps = {
      setOpen: jest.fn(),
      setUpdateSuccess: jest.fn(),
    };
    const tree = wrapper(true, defaultProps);
    const cancelButton = tree.getByTestId('user-form-cancel');
    userEvent.click(cancelButton);
    expect(defaultProps.setOpen.mock.calls.length).toEqual(2);
  });
});
