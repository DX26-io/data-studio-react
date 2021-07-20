import { ActionButton, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';
import { icon } from '@fortawesome/fontawesome-svg-core';
import CollectionEdit from '@spectrum-icons/workflow/CollectionEdit';
import React from 'react';

interface IHeaderIconProps {
  icon?: any;
  title?: string;
  onPress?: any;
  className?: string;
  color?: string;
  size?: string;
  data?: any;
}

const HeaderIcon: React.FC<IHeaderIconProps> = props => {
  return (
    <TooltipTrigger>
      <ActionButton onPress={props.data ? () => { props.onPress(props.data) } : () => { props.onPress() }} aria-label={props.title} isQuiet={true} >
        <div className={props.className}>
          {props.icon}
        </div>
      </ActionButton>
      <Tooltip>{props.title}</Tooltip>
    </TooltipTrigger>
  );
};

export default HeaderIcon;
