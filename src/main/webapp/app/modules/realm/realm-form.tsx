import React, { useState } from 'react';
import { Button, Checkbox, Flex, Text, TextField, View, Link, Form } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import {translate, Translate} from 'react-jhipster';

export interface IRealmProps {
  realmCreateError: boolean;
  handleCreate: (realmName: string) => void;
}
const RealmForm = (props: IRealmProps) => {
  const [realmName, setRealmName] = useState('');
  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const { handleCreate, realmCreateError } = props;

  const handleSubmit = event => {
    event.preventDefault();
    if (realmName) {
      setEmptyFieldError(false);
      handleCreate(realmName);
    } else {
      setEmptyFieldError(true);
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center" marginX="size-300">
      <Form width="size-4600" isRequired isQuiet onSubmit={handleSubmit} data-testid="realm-create-form">
        <View marginBottom="size-600">
          <span className="spectrum-Heading spectrum-Heading--sizeXXL">
            <Text>
              <Translate contentKey="realm.create.title">_title</Translate>
            </Text>
          </span>
        </View>
        <TextField
          width="100%"
          marginBottom="size-300"
          label={translate('realm.create.form.realmName')}
          type="text"
          data-testid="realmName"
          value={realmName}
          onChange={setRealmName}
        />
        {realmCreateError && !emptyFieldError && (
          <Flex gap="size-100" data-testid="realm-create-error">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message">
                <Translate contentKey="realm.create.messages.error.create">_error</Translate>
              </span>
            </Text>
          </Flex>
        )}
        {emptyFieldError && (
          <Flex gap="size-100" data-testid="empty-error">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message">
                <Translate contentKey="realm.create.messages.error.emptyFields">_empty fields</Translate>
              </span>
            </Text>
          </Flex>
        )}
        <Flex data-testid="realm-create-action" marginTop="size-400" alignItems="center" justifyContent="center" direction="row-reverse">
          <Button data-testid="submit" variant="cta" marginStart="auto" type="submit">
            <Translate contentKey="realm.create.form.button">_button</Translate>
          </Button>
        </Flex>
      </Form>
    </Flex>
  );
};

export default RealmForm;
