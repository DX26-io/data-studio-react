import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { View, Well } from '@adobe/react-spectrum';

export interface IDx26TitlePropertiesProps extends StateProps, DispatchProps {}

const Dx26TitleProperties = (props: IDx26TitlePropertiesProps) => {
  const [activeTabId, setActiveTabId] = useState('chartProperties');

  return (
    <>
      <View>
        <Well margin={0}>Title Properties</Well>
      </View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26TitleProperties);
