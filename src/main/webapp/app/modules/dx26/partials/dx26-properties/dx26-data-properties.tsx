import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

export interface IDx26DataPropertiesProps extends StateProps, DispatchProps {}

const Dx26DataProperties = (props: IDx26DataPropertiesProps) => {
  return (
    <>
      <View>data properties display here</View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26DataProperties);
