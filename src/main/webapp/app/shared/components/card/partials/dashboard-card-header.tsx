import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View, Text, Flex, ActionButton, Menu, MenuTrigger, Item, Divider } from '@adobe/react-spectrum'
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import Delete from '@spectrum-icons/workflow/Delete';
import Settings from '@spectrum-icons/workflow/Settings';
import AnchorSelect from '@spectrum-icons/workflow/AnchorSelect';

const CardHeader = () => {
  return (
    <>
      <View paddingX="size-250" paddingY="size-100">
        <Flex direction="row" gap="size-100" justifyContent="space-between" >
          <Flex alignItems="center">
            <span className="spectrum-Heading spectrum-Heading--sizeXXS">
              <Text>
                sales united states
            </Text>
            </span>
          </Flex>
          <Flex alignItems="center">
            <MenuTrigger>
              <ActionButton marginEnd="-15px" isQuiet aria-label="Icon only" >
                <MoreSmallListVert size="S" aria-label="Default Alert" />
              </ActionButton>
              <Menu>
                <Item key="Delete" textValue="Delete">
                  <Delete size="M" />
                  <Text>Delete</Text>
                </Item>
                <Item key="Edit" textValue="Edit">
                  <Settings size="M" />
                  <Text>Edit</Text>
                </Item>
                <Item key="Release" textValue="Release">
                  <AnchorSelect size="M" />
                  <Text>Release</Text>
                </Item>
              </Menu>
            </MenuTrigger>
          </Flex>
        </Flex>
        <Flex alignItems="center">
          <span className="pectrum-Body spectrum-Body--sizeXS">
            <Text >
              product sales dashboard for united states
          </Text>
          </span>
        </Flex>
      </View>
    </>
  );
}

export default CardHeader;
