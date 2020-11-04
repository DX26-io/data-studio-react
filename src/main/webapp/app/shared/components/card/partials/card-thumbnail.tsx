import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View, Image } from '@adobe/react-spectrum'

interface ICardThumbnailProps {
  thumbnail: React.ReactNode;
}
const CardThumbnail: React.FC<PropsWithChildren<ICardThumbnailProps>> = props => {

  return (
    <>
      <View>
        <Image width="200px" height="100px" src={props.thumbnail} alt="Sky and roof" />
      </View>
    </>
  );
}

export default CardThumbnail;
