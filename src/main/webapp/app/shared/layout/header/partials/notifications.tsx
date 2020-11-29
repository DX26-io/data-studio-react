import React from 'react';
import Bell from '@spectrum-icons/workflow/Bell';
import { Text, DialogTrigger, ActionButton, Dialog, Heading, Divider, Content } from '@adobe/react-spectrum';

const Notifications = () => {
  return (
    <DialogTrigger type="popover">
      <ActionButton aria-label="Notifications" isQuiet={true} marginEnd="size-200">
        <Bell size="M" />
      </ActionButton>
      <Dialog>
        <Heading>Notifications</Heading>
        <Divider />
        <Content>
          <Text>Notifications body</Text>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};
export default Notifications;
