import React from 'react';
import { Flex, Heading, ProgressCircle, Text, View } from '@adobe/react-spectrum';

const Loader: React.FC = props => {
  return (
    <>
      <Flex direction="column" alignItems="center" justifyContent="center" marginY="size-800">
        <View>
          <ProgressCircle size={'L'} aria-label="Loading…" isIndeterminate />
        </View>
        <View>
          <Heading>Loading</Heading>
        </View>
      </Flex>
    </>
  );
};

export default Loader;
