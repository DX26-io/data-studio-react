import React from 'react';
import {
  ActionButton,
  darkTheme,
  Item,
  Menu,
  MenuTrigger,
  Provider as SpectrumProvider,
  View
} from '@adobe/react-spectrum';
import Apps from '@spectrum-icons/workflow/Apps';

const RealmSwitcher = () => {
  return (
    <View marginEnd='size-300'>
      <MenuTrigger>
        <SpectrumProvider theme={darkTheme}>
          <ActionButton isQuiet={true}><Apps size='S' /></ActionButton>
        </SpectrumProvider>
        <Menu>
          <Item>Project 1</Item>
          <Item>Project 2</Item>
        </Menu>
      </MenuTrigger>
    </View>
  );
};

export default RealmSwitcher;
