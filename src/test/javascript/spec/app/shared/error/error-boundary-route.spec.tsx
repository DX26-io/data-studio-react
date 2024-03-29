import React from 'react';
import { Route } from 'react-router-dom';
import { shallow } from 'enzyme';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

const ErrorComp = () => {
  throw new Error('test');
};

describe('error-boundary-route component', () => {
  beforeEach(() => {
    // ignore console and jsdom errors
    jest.spyOn((window as any)._virtualConsole, 'emit').mockImplementation(() => false);
    jest.spyOn((window as any).console, 'error').mockImplementation(() => false);
  });

  // All tests will go here
  it('Should throw error when no component is provided', () => {
    expect(() => shallow(<ErrorBoundaryRoute />)).toThrow(Error);
  });

  // commented below test case for time being
  // it('Should render fallback component when an uncaught error is thrown from component', () => {
  //   const route = shallow(<ErrorBoundaryRoute component={ErrorComp} path="/" />);
  //   const renderedRoute = route.find(Route);
  //   expect(renderedRoute.length).toEqual(1);
  //   const props = renderedRoute.props() as any;
  //   expect(props.path).toEqual('/');
  //   expect(props.render).toBeDefined();
  //   const renderFn: Function = props.render;
  //   const comp = shallow(
  //     renderFn({
  //       location: '/',
  //     })
  //   );
  //   expect(comp.length).toEqual(1);
  //   expect(comp.html()).toEqual('<div><h2 class="error">An unexpected error has occurred.</h2></div>');
  // });
});
