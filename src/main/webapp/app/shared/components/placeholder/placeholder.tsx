import React from 'react';
import { Text, View } from '@adobe/react-spectrum';
import { getFirstLettersFromString } from 'app/shared/util/common-utils.ts';

interface IDisplayNamePlaceholderProps {
  displayName: string;
}

export const DisplayNamePlaceholder: React.FC<IDisplayNamePlaceholderProps> = ({ displayName }) => {
  return (
    <>
      <View backgroundColor="gray-200" padding="size-200" borderRadius="large">
        <span className="spectrum-Heading spectrum-Heading--XL spectrum-Heading--light">
          <span className="">
            <Text>{getFirstLettersFromString(displayName)}</Text>
          </span>
        </span>
      </View>
    </>
  );
};
