import React, { PropsWithChildren, useRef } from 'react';
import { useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import { View } from '@adobe/react-spectrum';

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
        borderRadius='regular'
        borderColor='default'
        borderWidth='thin'
        padding='size-200'
        position='absolute'
        top='size-600'
        right='size-100'
        backgroundColor='default'>
        {props.children}
      </View>}
    </>
  );
};

export default HeaderPopover;
