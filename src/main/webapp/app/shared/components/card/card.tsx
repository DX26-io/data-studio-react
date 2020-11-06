import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import CardThumbnail from 'app/shared/components/card/partials/card-thumbnail';
import CardHeader from 'app/shared/components/card/partials/dashboard-card-header';
import CardFooter from 'app/shared/components/card/partials/dashboard-card-footer';
import { View } from '@adobe/react-spectrum'

interface ICardsProps {
    thumbnail: string,
    header: React.ReactNode,
    footer: React.ReactNode,
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
        <CardThumbnail thumbnail={props.thumbnail} />
        {props.header}
        {props.footer}
        {/* <CardHeader
          header={props.header} />
        <CardFooter
          footer={props.footer} /> */}
      </View>
    </>
  );
}

export default Cards;
