import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';

const PinnedFiltersHeader = () => {
  return (
    <View borderColor="default"  borderBottomWidth="thin">
      <Flex justifyContent="start" alignItems="center" alignContent="start">
        <p className="spectrum-Heading--sizeXXS" style={{ padding: '10px 12px' }}>
          {/* need to place this in json and use translate component..there is no canvas/filter json availble..need to create it */}
          Pinned Filters
        </p>
      </Flex>
    </View>
  );
};
export default PinnedFiltersHeader;
