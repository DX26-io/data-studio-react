import React from 'react';
import { Route } from 'react-router-dom';
import { shallow } from 'enzyme';
import { TranslatorContext } from 'react-jhipster';
import { defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import { AUTHORITIES } from 'app/config/constants';
import { PrivateRoute, hasAnyAuthority, IPrivateRouteProps } from 'app/shared/auth/private-route';
import configureMockStore from 'redux-mock-store';

// some of the test cases are commented for time being

const TestComp = () => <div>Test</div>;

describe('private-route component', () => {
  const defaultPrivateProps = {
    authentication: {
      isAuthenticated: false,
      sessionHasBeenFetched: false,
      // isAuthorized: false,
      account: {
        userGroups: ['ROLE_USER', 'ROLE_ADMIN'],
      },
    },
  };

  const getProps = (props: IPrivateRouteProps) => {
    return props;
  };

  const mockStore = configureMockStore();
  const getStore = () => {
    return mockStore(defaultPrivateProps);
  };

  beforeAll(() => {
    TranslatorContext.registerTranslations('en', {});
  });

  // All tests will go here

  it('Should throw error when no component is provided', () => {
    expect(() => shallow(<PrivateRoute component={null} {...defaultPrivateProps} {...getProps(null)} />)).toThrow(Error);
  });

  // it('Should render an error message when the user has no authorities', () => {
  //   const route = shallow(
  //     <PrivateRoute
  //       {...getPrivateProps(true, [AUTHORITIES.USER, AUTHORITIES.ADMIN])}
  //       {...getProps(null)}
  //       component={TestComp}
  //       path="/"
  //       hasAnyAuthorities={[AUTHORITIES.USER]}
  //     />
      
  //   );
  //   const renderedRoute = route.find(Route);
  //   const props = renderedRoute.props() as any;
  //   const renderFn: Function = props.render;
  //   const comp = shallow(
  //     renderFn({
  //       location: '/',
  //     })
  //   );
  //   expect(comp.length).toEqual(1);
  //   const error = comp.find('div.insufficient-authority');
  //   expect(error.length).toEqual(1);
  //   expect(error.find('.alert-danger').html()).toEqual(
  //     '<div class="alert alert-danger"><span>You are not authorized to access this page.</span></div>'
  //   );
  // });

  // it('Should render a route for the component provided when authenticated', () => {
  //   const route = shallow(<PrivateRoute component={TestComp} isAuthenticated sessionHasBeenFetched isAuthorized path="/" />);
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
  //   expect(comp.html()).toEqual('<div>Test</div>');
  // });

  // it('Should render a redirect to login when not authenticated', () => {
  //   const route = shallow(
  //     <PrivateRoute component={TestComp} isAuthenticated={false} sessionHasBeenFetched isAuthorized path="/" />
  //   );
  //   const renderedRoute = route.find(Route);
  //   expect(renderedRoute.length).toEqual(1);
  //   const props = renderedRoute.props() as any;
  //   const renderFn: Function = props.render;
  //   // as rendering redirect outside router will throw error
  //   expect(() =>
  //     shallow(
  //       renderFn({
  //         location: '/',
  //       })
  //     ).html()
  //   ).toThrow(Error);
  // });
});

describe('hasAnyAuthority', () => {
  // All tests will go here
  it('Should return false when authorities is invalid', () => {
    expect(hasAnyAuthority(undefined, undefined)).toEqual(false);
    expect(hasAnyAuthority(null, [])).toEqual(false);
    expect(hasAnyAuthority({ userGroups: [] }, [])).toEqual(false);
    expect(hasAnyAuthority({ userGroups: [] }, [AUTHORITIES.USER])).toEqual(false);
  });

  it('Should return false when authorities is valid and hasAnyAuthorities is empty', () => {
    expect(hasAnyAuthority({ userGroups: [AUTHORITIES.USER] }, [])).toEqual(false);
  });

  it('Should return true when authorities is valid and hasAnyAuthorities contains an authority', () => {
    expect(hasAnyAuthority({ userGroups: [AUTHORITIES.USER, AUTHORITIES.ADMIN] }, [AUTHORITIES.USER])).toEqual(true);
    expect(hasAnyAuthority({ userGroups: [AUTHORITIES.USER, AUTHORITIES.ADMIN] }, [AUTHORITIES.USER])).toEqual(true);
    expect(hasAnyAuthority({ userGroups: [AUTHORITIES.USER, AUTHORITIES.ADMIN] }, [AUTHORITIES.USER, AUTHORITIES.ADMIN])).toEqual(true);
    expect(hasAnyAuthority({ userGroups: [AUTHORITIES.USER, AUTHORITIES.ADMIN] }, [AUTHORITIES.USER, 'ROLE_SUPER_ADMIN'])).toEqual(true);
    expect(hasAnyAuthority({ userGroups: [AUTHORITIES.USER, AUTHORITIES.ADMIN] }, [AUTHORITIES.ADMIN])).toEqual(true);
  });

  it('Should return false when authorities is valid and hasAnyAuthorities does not contain an authority', () => {
    expect(hasAnyAuthority({ userGroups: [AUTHORITIES.USER] }, [AUTHORITIES.ADMIN])).toEqual(false);
    expect(hasAnyAuthority({ userGroups: [AUTHORITIES.USER, AUTHORITIES.ADMIN] }, ['ROLE_USERSS'])).toEqual(false);
    expect(hasAnyAuthority({ userGroups: [AUTHORITIES.USER, AUTHORITIES.ADMIN] }, ['ROLEUSER', 'ROLE_SUPER_ADMIN'])).toEqual(false);
  });
});
