import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View } from '@adobe/react-spectrum';

interface IHeaderPopoverProps {
  icon: React.ReactNode;
}

const HeaderPopover: React.FC<PropsWithChildren<IHeaderPopoverProps>> = (props) => {
  const [IsContainerOpen, setIsContainerOpen] = useState(false);
  const container = useRef(null);
  const toggleContainer = () => setIsContainerOpen(!IsContainerOpen);
  const handleClickOutside = (event) => {
    if (IsContainerOpen && container.current && !container.current.contains(event.target)) {
      setIsContainerOpen(false);
    }
  };

  useEffect(() => {
    if (IsContainerOpen)
      document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [IsContainerOpen]);

  return (
    <>
      <View marginEnd='size-300'>
        <button className='header-icon' onClick={toggleContainer}>
          {props.icon}
        </button>
      </View>

      {IsContainerOpen &&
      <View
        borderRadius='regular'
        borderColor='default'
        borderWidth='thin'
        padding='size-200'
        position='absolute'
        top='size-600'
        right='size-100'
        backgroundColor='default'>
        <div className='header-popover-dropdown-container' ref={container}>
          {props.children}
        </div>
      </View>}
    </>
  );
};

export default HeaderPopover;
