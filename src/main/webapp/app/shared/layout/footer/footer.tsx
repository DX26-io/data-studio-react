import './footer.scss';

import React from 'react';
import {View, Text, Flex} from '@adobe/react-spectrum'

// TODO: Test Cases
const Footer = props => (
  <View padding={'size-150'} height={'size-600'}>
    <Flex justifyContent={'end'}>
      <Text>
        <i>DX26 © 2020</i>
      </Text>
    </Flex>
  </View>
);

export default Footer;
