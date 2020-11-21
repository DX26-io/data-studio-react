import './secondary-header.scss';

import React, { PropsWithChildren } from 'react';
import { View, Flex, Grid, Breadcrumbs, Item, Heading } from '@adobe/react-spectrum';
import { Link } from 'react-router-dom';

export interface IBreadcrumbItem {
  key: string;
  label: string;
  route: string;
}

export interface ISecondaryHeaderProps {
  breadcrumbItems: Array<IBreadcrumbItem>;
  title: string;
  children?: JSX.Element | JSX.Element[];
}

const SecondaryHeader: React.FC<PropsWithChildren<ISecondaryHeaderProps>> = props => {
  return (
    <View paddingX="size-150" paddingY="size-100" backgroundColor="default" borderBottomWidth={'thin'} borderBottomColor={'default'}>
      <Grid areas={['breadcrumbs title options']} columns={['1fr', '1fr', '1fr']} maxHeight={'size-600'}>
        <Breadcrumbs size="M">
          {props.breadcrumbItems.map(item => (
            <Item key={item.key}>
              <Link to={item.route}>{item.label}</Link>
            </Item>
          ))}
        </Breadcrumbs>
        <Flex gridArea="title" justifyContent="center" alignItems="center">
          <Heading level={3} marginY="size-0">
            {props.title}
          </Heading>
        </Flex>
        <Flex gridArea="options" justifyContent="end" alignItems="center">
          {props.children}
        </Flex>
      </Grid>
    </View>
  );
};

export default SecondaryHeader;
