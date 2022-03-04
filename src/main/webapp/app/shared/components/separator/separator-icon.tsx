import React from 'react';
import { Tooltip, TooltipTrigger, ActionButton } from '@adobe/react-spectrum';
import { Translate } from 'react-jhipster';
import Separator from '@spectrum-icons/workflow/Separator';

interface ISeparatorIconProps {
  toggleCommaSeparator: (isSeparatedOn: boolean) => void;
  isSeparatedOn: boolean;
}

const SeparatorIcon: React.FC<ISeparatorIconProps> = ({ toggleCommaSeparator, isSeparatedOn }) => {
  return (
    <TooltipTrigger>
      <ActionButton
        isQuiet
        onPress={() => {
          toggleCommaSeparator(!isSeparatedOn);
        }}
      >
        <Separator size="S" />
      </ActionButton>
      <Tooltip>
        {isSeparatedOn ? (
          <Translate contentKey="separators.tooltipCommaSeparatedOff"></Translate>
        ) : (
          <Translate contentKey="separators.tooltipCommaSeparatedOn"></Translate>
        )}
      </Tooltip>
    </TooltipTrigger>
  );
};

export default SeparatorIcon;
