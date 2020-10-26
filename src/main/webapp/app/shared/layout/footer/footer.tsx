import './footer.scss';

import React from 'react';
import {View, Text, Flex} from '@adobe/react-spectrum'

import { CommonConstants } from 'app/shared/util/common.constants';

// TODO: Test Cases
const Footer = props => (
  <View paddingY={'size-75'} paddingX={'size-150'} height={'size-400'}>
    <Flex justifyContent={'end'} alignItems="center">
      <Text>{CommonConstants.DX26} {CommonConstants.COPYRIGHT} 2020</Text>
    </Flex>
  </View>
);

export default Footer;
