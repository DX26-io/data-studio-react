import React, { PropsWithChildren } from 'react';
import { Divider, View } from '@adobe/react-spectrum';

interface ICardProps {
  thumbnail: React.ReactNode;
  content: React.ReactNode;
}

const Card: React.FC<ICardProps> = props => {
  return (
    <>
      <View borderWidth="thin" borderColor="default" width="static-size-3400" backgroundColor="gray-75" borderRadius="regular">
        {props.thumbnail}
        <Divider size="S" />
        {props.content}
      </View>
    </>
  );
};

export default Card;
