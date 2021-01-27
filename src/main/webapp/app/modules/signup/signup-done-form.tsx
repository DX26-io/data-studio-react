import React, {useState} from 'react';
import {Button, Checkbox, Flex, Text, TextField, View, Link, Form} from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import {Translate} from 'react-jhipster';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISignupDoneProps {
}

export const SignupDoneForm = (props: ISignupDoneProps) => {

  return (
    <Flex alignItems="center"
          justifyContent="center"
          gap="size-100"
          direction="column">
      <View marginBottom="size-600">
          <span className="spectrum-Heading spectrum-Heading--sizeXXL">
            <Text>
              <Translate contentKey="signup.title">_Signup</Translate>
            </Text>
          </span>
      </View>
      <View>
        <Text>
          <Translate contentKey="signup.done">_signup done</Translate>
        </Text>
      </View>
    </Flex>
  );
};

export default SignupDoneForm;
