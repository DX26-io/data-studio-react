import React from 'react';
import { DashboardPermissionContainer } from 'app/modules/administration/user-management/permissions/dashboards/dashboard-permissions-container';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { shallow } from 'enzyme';
import { Grid, View } from '@adobe/react-spectrum';

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
    dashboardPermissions: [],
    totalDashboardPermissions: 0,
  };

  const wrapper = () => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore(getInitialState());

    if (!mountedWrapper) {
      mountedWrapper = shallow(<DashboardPermissionContainer {...permissionsProps} />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render Dashboard Permission Container', () => {
    const tree = wrapper();
    const gridItem = tree.find(Grid);
    expect(gridItem.length).toEqual(1);
    const viewItem = tree.find(View);
    expect(viewItem.length).toEqual(3);
  });
});
