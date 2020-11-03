import React from 'react';
import Bell from '@spectrum-icons/workflow/Bell';
import HeaderPopover from './header-popover';
import { Text } from '@adobe/react-spectrum';

const Notifications = () => {
  return (
    <HeaderPopover icon={<Bell />}>
      <Text>Here goes the notifications</Text>
    </HeaderPopover>
  );
};
export default Notifications;
