import React from 'react';
import { Flex, ActionButton, Content, Dialog, DialogTrigger } from '@adobe/react-spectrum';

import More from '@spectrum-icons/workflow/MoreSmallListVert';
import CanvasHeaderIcon from 'app/shared/components/canvas-header-icon/canvas-header-icon';

// TODO : keeping it for now. will be deleted in furure 

interface ISmallScreenMoreProps {
  headerIconList: any;
}

const SmallScreenMore: React.FC<ISmallScreenMoreProps> = props => {
  return (
    <DialogTrigger type="popover">
      <ActionButton isQuiet={true}>
        <More size="M" />
      </ActionButton>
      <Dialog>
        <Content>
          <Flex wrap gap="size-100" marginTop="size-50">
            {props.headerIconList.map(card => (
              <CanvasHeaderIcon
                key={`small-screen-${card.title}`}
                icon={card.icon}
                title={card.title}
                className={card.className}
                onPress={card.onPress}
                data={card.data}
              />
            ))}
          </Flex>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};

export default SmallScreenMore;
