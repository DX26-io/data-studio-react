import React, { PropsWithChildren } from 'react';
import { Flex, ActionButton } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import Minimize from '@spectrum-icons/workflow/Minimize';
import Maximize from '@spectrum-icons/workflow/Maximize';

export interface IPanelHeaderProps {
  setMinimize: (isMinimized: boolean) => void;
  isMinimized: boolean;
  titleKey:string;
  addIcon?: React.ReactElement;
}

const PanelHeader: React.FC<PropsWithChildren<IPanelHeaderProps>> = props => {
  return (
    <Flex direction="row" justifyContent="center" alignItems="center" marginStart="size-175" marginEnd="size-175">
      <span className="spectrum-Heading--sizeXXS" style={{ marginRight: 'auto' }}>
        <Translate contentKey={props.titleKey}>Features</Translate>
      </span>
        {props.addIcon}
      <div style={{ marginRight: '-11px' }}>
        {props.isMinimized ? (
          <ActionButton
            onPress={() => {
              props.setMinimize(!props.isMinimized);
            }}
            isQuiet={true}
          >
            <Maximize></Maximize>
          </ActionButton>
        ) : (
          <ActionButton
            onPress={() => {
              props.setMinimize(!props.isMinimized);
            }}
            isQuiet={true}
          >
            <Minimize></Minimize>
          </ActionButton>
        )}
      </div>
    </Flex>
  );
};

export default PanelHeader;
