import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View, Text, Flex } from '@adobe/react-spectrum'
import Typography from '@material-ui/core/Typography';
import Edit from '@spectrum-icons/workflow/Edit';
import PublishCheck from '@spectrum-icons/workflow/PublishCheck';

interface ICardThumbnailProps {
  modifyDate: React.ReactNode;
  status: React.ReactNode;
}
const CardFooter: React.FC<PropsWithChildren<ICardThumbnailProps>> = props => {
  return (
    <>
      <View>
        <Flex direction="row" gap="size-100" >
          <View  >
            <Edit aria-label="S Edit" size="XS" />
            <Text>{props.modifyDate}</Text>
          </View>
          <View alignSelf={'flex-end'}>
            <PublishCheck aria-label="S Edit" size="XS" />
            <Text>{props.status}</Text>
          </View>
        </Flex>
      </View>
    </>
  );
}

export default CardFooter;
