import React, { PropsWithChildren, useRef } from 'react';
import { useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import { View } from '@adobe/react-spectrum';
import {headerStyles} from './header-style';

interface IHeaderPopoverProps {
  icon: React.ReactNode;
}

const HeaderPopover: React.FC<PropsWithChildren<IHeaderPopoverProps>> = (props) => {
  const iconRef = useRef();
  const iconToggleState = useToggleState(props);
  const { buttonProps } = useToggleButton(props, iconToggleState, iconRef);

  const handleOnBlur = () => {
    iconToggleState.setSelected(false);
  };

  return (
    <>
      <View marginEnd='size-300'>
        <button {...buttonProps} ref={iconRef} onBlur={handleOnBlur} className='header-icon'>
          {props.icon}
        </button>
      </View>

      {iconToggleState.isSelected &&
      <View
        borderRadius={headerStyles.borderRadius}
        borderColor={headerStyles.borderColor}
        borderWidth={headerStyles.borderWidth}
        padding={headerStyles.padding}
        position={headerStyles.position}
        top={headerStyles.top}
        right={headerStyles.right}
        backgroundColor={headerStyles.backgroundColor}>
        {props.children}
      </View>}
    </>
  );
};

export default HeaderPopover;
