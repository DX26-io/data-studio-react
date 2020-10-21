import './secondary-header.scss'

import React, { PropsWithChildren, ReactNode } from 'react';
import { View, Flex, Grid, Breadcrumbs, Item } from '@adobe/react-spectrum';

export interface IBreadcrumbItem {
  key: string
  label: string
  route: string
}

export interface ISecondaryHeaderProps {
  breadcrumbItems: Array<IBreadcrumbItem>
  title: string
  children: Array<JSX.Element>
}

const SecondaryHeader: React.FC<PropsWithChildren<ISecondaryHeaderProps>> = (props) => {
  return (
    <View paddingX="size-150" paddingY="size-100" backgroundColor="static-white">
      <Grid
        areas={['breadcrumbs title options']}
        columns={['1fr', '1fr', '1fr']}
        maxHeight={'size-600'}>
        <Flex
          gridArea="breadcrumbs"
          justifyContent="start"
          alignItems="center">
          <Breadcrumbs>
            {props.breadcrumbItems.map(item => (
              <Item key={item.key}>
                {item.label}
              </Item>
            ))}
          </Breadcrumbs>
        </Flex>
        <Flex
          gridArea="title"
          justifyContent="center"
          alignItems="center">
          <p className="secondary-header-title">{props.title}</p>
        </Flex>
        <Flex
          gridArea="options"
          justifyContent="end"
          alignItems="center">
          {props.children}
        </Flex>
      </Grid>
    </View>
  )
}

export default SecondaryHeader
