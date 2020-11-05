import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View, Text, Flex } from '@adobe/react-spectrum'
import Typography from '@material-ui/core/Typography';
import Edit from '@spectrum-icons/workflow/Edit';
import PublishCheck from '@spectrum-icons/workflow/PublishCheck';
import '../card.scss';
interface ICardThumbnailProps {
  footer: {
    modifyDate: string,
    status: boolean
  }
}
const CardFooter: React.FC<ICardThumbnailProps> = props => {
  return (
    <>
      <View UNSAFE_className="cardFooter" paddingStart="size-250" paddingEnd="size-250" paddingBottom="size-250">
        <Flex direction="row" gap="size-100" justifyContent="space-between" >
          <Flex alignItems="center">
            <Edit aria-label="S Edit" size="XS" />
            <Text marginStart="size-50">{props.footer.modifyDate}</Text>
          </Flex>
          <Flex alignItems="center">
            <PublishCheck aria-label="S Edit" size="XS" />
            {props.footer.status ? (
              <Text marginStart="size-50">Published</Text>
            ) : (
                <Text marginStart="size-50">Not published</Text>
              )}
          </Flex>
        </Flex>
      </View>
    </>
  );
}

export default CardFooter;
