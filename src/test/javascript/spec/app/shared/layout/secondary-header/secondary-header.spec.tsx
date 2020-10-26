import React from 'react';
import { shallow } from 'enzyme';

import {View, Grid, Flex, Heading, Breadcrumbs, Item, Button} from '@adobe/react-spectrum'

import SecondaryHeader, { ISecondaryHeaderProps } from 'app/shared/layout/secondary-header/secondary-header';


describe('SecondaryHeader', () => {
  let mountedWrapper;

  const defaultProps: ISecondaryHeaderProps = {
    breadcrumbItems: [
      { key: "home", label: "Home", route: "/" },
      { key: "dashboards", label: "Dashboards", route: "/dashboards" },
      { key: "d123", label: "Inventory Dashboard", route: "/dashboards/d123" },
      { key: "v123", label: "Stock", route: "/dashboards/d123/v123" }
    ],
    title: "SH Unit Test"
  }

  const wrapper = (props = defaultProps) => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<SecondaryHeader {...props}/>);
    }
    return mountedWrapper;
  };

  const wrapperWithChildren = (props = defaultProps) => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(
        <SecondaryHeader {...props}>
          <Button
            variant="primary"
            marginX="size-150">
            Edit
          </Button>
          <Button
            variant="secondary">
            Save
          </Button>
        </SecondaryHeader>
      );
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('Renders Secondary Header with default Props', () => {
    const component = wrapper()
    expect(component).toMatchSnapshot();
  })

  it('Renders Secondary Header with children', () => {
    const component = wrapperWithChildren()
    expect(component).toMatchSnapshot();
  })

});
