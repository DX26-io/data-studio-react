import './footer.scss';

import React from 'react';
import {View, Text, Flex} from '@adobe/react-spectrum'

// TODO: Test Cases
const Footer = props => (
  <View paddingY={'size-75'} paddingX={'size-150'} height={'size-400'}>
    <Flex justifyContent={'end'} alignItems="center">
      <p className="copyright">DX26 © 2020</p>
    </Flex>
  </View>
);

export default Footer;
