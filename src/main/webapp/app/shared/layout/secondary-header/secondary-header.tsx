import './secondary-header.scss';

import React, { PropsWithChildren } from 'react';
import { Breadcrumbs, Flex, Grid, Heading, Item, View } from '@adobe/react-spectrum';
import { useHistory } from 'react-router-dom';

export interface IBreadcrumbItem {
  label: string;
  route: string;
}

export interface ISecondaryHeaderProps {
  breadcrumbItems: Array<IBreadcrumbItem>;
  title: string;
  children?: Array<JSX.Element>;
}

const SecondaryHeader: React.FC<PropsWithChildren<ISecondaryHeaderProps>> = props => {
  const history = useHistory();
  return (
    <View paddingX="size-150" paddingY="size-100" backgroundColor="default" borderBottomWidth={'thin'} borderBottomColor={'default'}>
      <Grid areas={['breadcrumbs title options']} columns={['1fr', '1fr', '1fr']} maxHeight={'size-600'}>
        <Flex gridArea="breadcrumbs" justifyContent="start" alignItems="center">
          <Breadcrumbs size="M" onAction={key => history.push(`${key}`)}>
            {props.breadcrumbItems.map(item => (
              <Item key={item.route}>{item.label}</Item>
            ))}
          </Breadcrumbs>
        </Flex>
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
