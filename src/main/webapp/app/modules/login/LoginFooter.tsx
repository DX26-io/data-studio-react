import React from 'react';
import { Text } from '@adobe/react-spectrum'

import { CommonConstants } from '../../shared/util/common.constants';

// TODO: Test Cases
// TODO : year should come dynamically 

const LoginFooter = props => (
    <Text position="absolute" right="3%" bottom="4%">{CommonConstants.DX26} {CommonConstants.COPYRIGHT} 2020</Text>
);

export default LoginFooter;
