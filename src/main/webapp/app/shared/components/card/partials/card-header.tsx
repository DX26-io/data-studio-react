import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { View, Text, Flex, ActionButton, Menu, MenuTrigger, Item } from '@adobe/react-spectrum'
import Typography from '@material-ui/core/Typography';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import Delete from '@spectrum-icons/workflow/Delete';
import Settings from '@spectrum-icons/workflow/Settings';
import AnchorSelect from '@spectrum-icons/workflow/AnchorSelect';

interface ICardHeaderProps {
  title: React.ReactNode;
  description: React.ReactNode;
}

const CardHeader: React.FC<PropsWithChildren<ICardHeaderProps>> = props => {
  return (
    <>
      <View>
        <View>
          <Flex direction="row" gap="size-100">
            <View  >
              <Text>
                <Typography variant="h6" className="pos" component={'p'}>
                  {props.title}
                </Typography>
              </Text>
            </View>
            <View width="size-10" >
              <MenuTrigger>
                <ActionButton aria-label="Icon only" isQuiet>
                  <MoreSmallListVert size="XS" aria-label="Default Alert" />
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


            </View>
          </Flex>
        </View>
        <View>
          <Text>
            <Typography variant="body2" component={'p'} color={'textSecondary'}>
              {props.description}
            </Typography>
          </Text>
        </View>
      </View>
    </>
  );
}

export default CardHeader;
