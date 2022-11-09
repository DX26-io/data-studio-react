import React from 'react';
import { Content, Flex, Heading, IllustratedMessage, Text, View } from '@adobe/react-spectrum';
import { getFirstLettersFromString } from 'app/shared/util/common-utils';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { Translate } from 'react-jhipster';
import NoSearchResults from '@spectrum-icons/illustrations/NoSearchResults';

interface IDisplayNamePlaceholderProps {
  displayName: string;
}

interface INoItemsFoundPlaceHolder {
  headerTranslationKey: string;
  contentTranslationKey: string;
}

export const DisplayNamePlaceholder: React.FC<IDisplayNamePlaceholderProps> = ({ displayName }) => {
  return (
    <View backgroundColor="gray-200" padding="size-200" borderRadius="large">
      <span className="spectrum-Heading spectrum-Heading--sizeXL spectrum-Heading--light">
        <span className="">
          <Text>{getFirstLettersFromString(displayName)}</Text>
        </span>
      </span>
    </View>
  );
};

export const NoItemsFoundPlaceHolder: React.FC<INoItemsFoundPlaceHolder> = ({ headerTranslationKey, contentTranslationKey }) => {
  return (
    <Flex direction="row" alignItems="center" justifyContent="center" marginY="size-800">
      <IllustratedMessage>
        <NotFound />
        <Heading>
          <Translate contentKey={headerTranslationKey}>No items found header</Translate>
        </Heading>
        <Content>
          <Translate contentKey={contentTranslationKey}>No items found content</Translate>
        </Content>
      </IllustratedMessage>
    </Flex>
  );
};

export const NoDataFoundPlaceHolder = () => {
  return (
    <Flex direction="row" alignItems="center" justifyContent="center" marginY="size-800">
      <IllustratedMessage>
        <NoSearchResults />
        <Heading>No matching results</Heading>
        <Content>Try another search.</Content>
      </IllustratedMessage>
    </Flex>
  );
};
