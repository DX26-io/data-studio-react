import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import CardThumbnail from 'app/shared/components/card/partials/card-thumbnail';
import CardHeader from 'app/shared/components/card/partials/card-header';
import CardFooter from 'app/shared/components/card/partials/card-footer';
import { View } from '@adobe/react-spectrum'

interface ICardsProps {
  data: {
    thumbnail: string,
    header: {
      title: string,
      description: string
    },
    footer: {
      modifyDate: string,
      status: boolean
    }
  }
}

const Cards: React.FC<ICardsProps> = props => {
  return (
    <>
      <View 
        borderWidth="thin"
        borderColor="dark"
        width="size-3600"
        backgroundColor="static-white"
      >
        <CardThumbnail thumbnail={props.data.thumbnail} />
        <CardHeader
          header={props.data.header} />
        <CardFooter
          footer={props.data.footer} />
      </View>
    </>
  );
}

export default Cards;
