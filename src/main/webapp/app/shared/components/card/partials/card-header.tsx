import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View, Text, Flex, ActionButton, Menu, MenuTrigger, Item, Divider } from '@adobe/react-spectrum'
import Typography from '@material-ui/core/Typography';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import Delete from '@spectrum-icons/workflow/Delete';
import Settings from '@spectrum-icons/workflow/Settings';
import AnchorSelect from '@spectrum-icons/workflow/AnchorSelect';
//import './card-header.scss';
interface ICardHeaderProps {
  header: {
    title: string,
    description: string
  }
}

const CardHeader: React.FC<ICardHeaderProps> = props => {
  return (
    <>
      <View paddingX="size-250"  paddingY="size-100">
        <Flex direction="row" gap="size-100" justifyContent="space-between" >
          <Flex alignItems="center">
            <Text UNSAFE_className="spectrum-Heading spectrum-Heading--sizeXXS">
              {props.header.title}
            </Text>
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
          <Text UNSAFE_className="spectrum-Body spectrum-Body--sizeXS">
            {props.header.description}
          </Text>
        </Flex>
      </View>
    </>
  );
}

export default CardHeader;
