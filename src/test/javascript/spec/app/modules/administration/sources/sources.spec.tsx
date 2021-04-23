import React from 'react';
import { shallow } from 'enzyme';
import { Flex } from '@adobe/react-spectrum';
import { RouteComponentProps } from 'react-router-dom';
import  Sources  from 'app/modules/administration/sources/sources';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import LinkCard from 'app/shared/components/link-card/link-card';

describe('Sources', () => {
  let mountedWrapper;

  const sourcesProps = {
    history: { push: jest.fn() } as any,
    location: {} as any,
    match: { url: '/administration/sources' } as any,
  };

  const wrapper = (props: RouteComponentProps) => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore();
    if (!mountedWrapper) {
      mountedWrapper = shallow(<Sources {...sourcesProps} />);
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render sources', () => {
    const tree = wrapper(null);
    const flexItem = tree.find(Flex);
    expect(flexItem.length).toEqual(1);
    const listItems = tree.find(LinkCard);
    expect(listItems.length).toEqual(2);
  });
});
