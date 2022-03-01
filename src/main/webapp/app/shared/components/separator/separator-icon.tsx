import React from 'react';
import { Tooltip, TooltipTrigger, ActionButton } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import Separator from '@spectrum-icons/workflow/Separator';

interface ISeparatorIconProps {
  toggleCommaSeparator: (condition: any) => void;
  condition: any;
}

const SeparatorIcon: React.FC<ISeparatorIconProps> = ({ toggleCommaSeparator, condition }) => {
  return (
    <TooltipTrigger>
      <ActionButton
        isQuiet
        onPress={() => {
          toggleCommaSeparator(condition);
        }}
      >
        <Separator size="S" />
      </ActionButton>
      <Tooltip>
        {condition.isCommaSeparatedInputOn ? (
          <Translate contentKey="separators.tooltipCommaSeparatedOff"></Translate>
        ) : (
          <Translate contentKey="separators.tooltipCommaSeparatedOn"></Translate>
        )}
      </Tooltip>
    </TooltipTrigger>
  );
};

export default SeparatorIcon;
