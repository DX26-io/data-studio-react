import React from 'react';
import { shallow } from 'enzyme';

import {View, Flex, Text} from '@adobe/react-spectrum'

import Footer from 'app/shared/layout/footer/footer';


describe('Footer', () => {
  let mountedWrapper

  const defaultProps = {}

  const wrapper = (props = defaultProps) => {
    if (!mountedWrapper) {
      mountedWrapper = shallow(<Footer {...props}/>)
    }
    return mountedWrapper
  };

  beforeEach(() => {
    mountedWrapper = undefined
  });

  it('Renders Footer with default Props', () => {
    const component = wrapper()
    expect(component).toMatchSnapshot()

    const mainView = component.find(View)
    expect(mainView.length).toEqual(1)

    const flex = mainView.find(Flex)
    expect(mainView.length).toEqual(1)

    const text = flex.find(Text)
    expect(text.length).toEqual(1)
  })
});
