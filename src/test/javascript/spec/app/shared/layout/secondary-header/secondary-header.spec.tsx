import React from 'react';
import { shallow } from 'enzyme';

import { Breadcrumbs, Item, Button } from '@adobe/react-spectrum';

import SecondaryHeader, { ISecondaryHeaderProps } from 'app/shared/layout/secondary-header/secondary-header';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('SecondaryHeader', () => {
  let mountedWrapper;

  const defaultProps: ISecondaryHeaderProps = {
    breadcrumbItems: [
      { label: 'Home', route: '/' },
      { label: 'Dashboards', route: '/dashboards' },
      { label: 'Inventory Dashboard', route: '/dashboards/d123' },
      { label: 'Stock', route: '/dashboards/d123/v123' },
    ],
    title: 'SH Unit Test',
  };

  const wrapper = (props = defaultProps) => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<SecondaryHeader {...props} />);
    }
    return mountedWrapper;
  };

  const wrapperWithChildren = (props = defaultProps) => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(
        <SecondaryHeader {...props}>
          <Button variant="primary" marginX="size-150">
            Edit
          </Button>
          <Button variant="secondary">Save</Button>
        </SecondaryHeader>
      );
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders Secondary Header with default Props', () => {
    const component = wrapper();
    expect(component).toMatchSnapshot();
  });

  it('Renders Secondary Header with children', () => {
    const component = wrapperWithChildren();
    expect(component).toMatchSnapshot();
  });

  it('Validate Breadcrumb Items', () => {
    const breadcrumbs = wrapper().find(Breadcrumbs);
    const breadcrumbItems = breadcrumbs.find(Item);
    expect(breadcrumbItems.length).toEqual(defaultProps.breadcrumbItems.length);
  });
});
