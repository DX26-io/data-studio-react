import React from 'react';
import { View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

export interface IDx26DataConstraintsSettingsProps extends StateProps, DispatchProps {}

const Dx26DataConstraintsSettings = (props: IDx26DataConstraintsSettingsProps) => {
  return (
    <>
      <View>Data Constraints display here</View>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dx26DataConstraintsSettings);
