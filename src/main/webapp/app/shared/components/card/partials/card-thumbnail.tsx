import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View, Image, Divider, Flex } from '@adobe/react-spectrum'

interface ICardThumbnailProps {
  thumbnail: string;
}
const CardThumbnail: React.FC<ICardThumbnailProps> = props => {
  return (
    <>
      <View >
        <Flex marginY="size-600" direction="row" gap="size-100" justifyContent="center" >
          <Image width="75px" height="75px" src={props.thumbnail} alt="Sky and roof" />
        </Flex>
        <Divider size="S" />
      </View>
    </>
  );
}
export default CardThumbnail;
