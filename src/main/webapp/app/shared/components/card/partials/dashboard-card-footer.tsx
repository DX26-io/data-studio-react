import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View, Text, Flex } from '@adobe/react-spectrum'
import Typography from '@material-ui/core/Typography';
import Edit from '@spectrum-icons/workflow/Edit';
import PublishCheck from '@spectrum-icons/workflow/PublishCheck';
import '../card.scss';

const CardFooter = () => {
  const footer = false;
  return (
    <>
      <View paddingStart="size-250" paddingEnd="size-250" paddingBottom="size-250">
        <Flex direction="row" gap="size-100" justifyContent="space-between" >
          <Flex alignItems="center">
            <Edit aria-label="S Edit" size="XS" />
            <span className="cardFooter">
              <Text marginStart="size-50">May 13,2020</Text>
            </span>

          </Flex>
          <Flex alignItems="center">
            <PublishCheck aria-label="S Edit" size="XS" />
            <span className="cardFooter">
              {footer ? (
                <Text marginStart="size-50">Published</Text>
              ) : (
                  <Text marginStart="size-50">Not published</Text>
                )}
            </span>
          </Flex>
        </Flex>
      </View>
    </>
  );
};





export default CardFooter;
