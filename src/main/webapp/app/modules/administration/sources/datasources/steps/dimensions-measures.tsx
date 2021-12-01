import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { getFeatureTypes, onFeaturesFetched } from './datasource-util';
import { IRootState } from 'app/shared/reducers';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import { getFeatures } from '../../connections/connection.reducer';
import { Flex, Picker, Item, Checkbox, Text, ProgressBar } from '@adobe/react-spectrum';
import { COMPARABLE_DATA_TYPES } from 'app/config/constants';
import { setFeatures } from './datasource-steps.reducer';
import { getDatasourceFeaturesEntities } from 'app/entities/feature/feature.reducer';

interface IDimensionsMeasures extends StateProps, DispatchProps {
  datasourceId: number;
}

export const DimensionsMeasures = (props: IDimensionsMeasures) => {
  const {
    updatedFeatures,
    metaData,
    datasourceId,
    features,
    loading,
    updateFeaturesRequest,
    isFeaturesReceived,
    isMetaDataReceived,
  } = props;

  useEffect(() => {
    const body = {
      metaRetrieved: true,
      limit: 1,
      distinct: false,
    };
    props.getFeatures(datasourceId, body);
    props.getDatasourceFeaturesEntities(datasourceId);
  }, []);

  useEffect(() => {
    if (isMetaDataReceived && isFeaturesReceived) {
      const _updatedFeatures = onFeaturesFetched(features, metaData);
      props.setFeatures(_updatedFeatures);
    }
  }, [isFeaturesReceived, isMetaDataReceived]);

  const isTemporalFeature = feature => {
    return COMPARABLE_DATA_TYPES.includes(feature.type.toLowerCase());
  };

  return (
    <div className="dx26-container">
      {loading || updateFeaturesRequest ? (
        <ProgressBar label={features.length > 0 ? 'Creating…' : 'Loading…'} isIndeterminate />
      ) : (
        <Paper className="dx26-table-pager">
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Translate contentKey="datasources.dimensionsAndMeasures.name">Name</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="datasources.dimensionsAndMeasures.type">Type</Translate>
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="datasources.dimensionsAndMeasures.enableDateFilter">Enable Date Time Filter</Translate>
                    Enable Date Time Filter
                  </TableCell>
                  <TableCell align="center">
                    <Translate contentKey="datasources.dimensionsAndMeasures.cache">Cache</Translate>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {updatedFeatures.map((feature, i) => (
                  <TableRow key={`feature-${i}`}>
                    <TableCell align="center">
                      <Flex direction="row" gap="size-100" alignItems="center">
                        <Checkbox
                          onChange={() => {
                            feature.isSelected = !feature.isSelected;
                          }}
                          defaultSelected={feature.isSelected}
                          isEmphasized
                        ></Checkbox>
                        <Text>{feature.name}</Text>
                      </Flex>
                    </TableCell>
                    <TableCell align="center">
                      <Picker
                        placeholder={translate('datasources.dimensionsAndMeasures.selectFeatureType')}
                        items={getFeatureTypes()}
                        defaultSelectedKey={feature.featureType}
                        onSelectionChange={selected => {
                          feature.featureType = selected.toString();
                        }}
                      >
                        {item => <Item key={item.name}>{item.name}</Item>}
                      </Picker>
                    </TableCell>
                    <TableCell align="center">
                      {isTemporalFeature(feature) ? (
                        <Checkbox
                          onChange={event => {
                            feature.dateFilter = event ? 'ENABLED' : 'DISABLED';
                          }}
                          defaultSelected={feature.dateFilter === 'ENABLED' ? true : false}
                          isEmphasized
                        ></Checkbox>
                      ) : null}
                    </TableCell>
                    <TableCell align="center">
                      {' '}
                      <Checkbox
                        onChange={event => {
                          feature.featureCacheType = event ? 'ENABLED' : 'DISABLED';
                        }}
                        defaultSelected={feature.featureCacheType === 'ENABLED' ? true : false}
                        isEmphasized
                      ></Checkbox>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  metaData: storeState.connections.metaData,
  loading: storeState.connections.loading,
  updateFeaturesRequest: storeState.datasources.updateFeaturesRequest,
  features: storeState.feature.entities,
  isFeaturesReceived: storeState.feature.isFeaturesReceived,
  isMetaDataReceived: storeState.connections.isMetaDataReceived,
  updatedFeatures: storeState.datasourceSteps.features,
});

const mapDispatchToProps = { getFeatures, setFeatures, getDatasourceFeaturesEntities };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DimensionsMeasures);
