import React from 'react';
import { Text, Flex } from '@adobe/react-spectrum';

import { CommonConstants } from '../../shared/util/common.constants';

// TODO: Place the text to the bottom right

const SignupFooter: React.FC = () => (
  <Flex direction="row-reverse">
    <Text marginEnd="size-300">
      {CommonConstants.DX26} {CommonConstants.COPYRIGHT} {new Date().getFullYear()}
    </Text>
  </Flex>
);

export default SignupFooter;
