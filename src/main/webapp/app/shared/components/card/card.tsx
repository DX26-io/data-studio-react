import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import CardThumbnail from 'app/shared/components/card/partials/card-thumbnail';
import CardHeader from 'app/shared/components/card/partials/card-header';
import CardFooter from 'app/shared/components/card/partials/card-footer';
import { View } from '@adobe/react-spectrum'

interface ICardsProps {
  thumbnail: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  footer: React.ReactNode;
  modifyDate: React.ReactNode;
  status: React.ReactNode;
}

const Cards: React.FC<PropsWithChildren<ICardsProps>> = props => {
  return (
    <>
      <View
        borderWidth="thin"
        borderColor="dark"
        width="250px"
        borderRadius="medium"
        padding="size-250">
        <CardThumbnail thumbnail={props.thumbnail} />
        <CardHeader
          title={props.title}
          description={props.description} />
        <CardFooter
          modifyDate={props.modifyDate}
          status={props.status} />
      </View>
    </>
  );
}

export default Cards;
