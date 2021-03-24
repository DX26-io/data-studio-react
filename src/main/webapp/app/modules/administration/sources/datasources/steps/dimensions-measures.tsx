import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { getFeatureTypes } from './datasource-util';
import { IRootState } from 'app/shared/reducers';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import { getFeatures, addFeatures } from '../../connections/connections.reducer';
import { Flex, Picker, Item, Checkbox, Text, ProgressBar } from '@adobe/react-spectrum';
import { COMPARABLE_DATA_TYPES } from 'app/config/constants';

interface IDimensionsMeasures extends StateProps, DispatchProps {
  datasourceId: number;
}

export const DimensionsMeasures = (props: IDimensionsMeasures) => {
  const { datasourceId, features, isAddFeaturesCalled, loading, updatedFeaturesRequest } = props;

  useEffect(() => {
    if (features.length === 0) {
      const body = {
        metaRetrieved: true,
        limit: 1,
        distinct: false,
      };
      props.getFeatures(datasourceId, body);
    }
  }, []);

  useEffect(() => {
    if (isAddFeaturesCalled) {
      props.addFeatures({
        datasourceId,
        featureList: features,
      });
    }
  }, [isAddFeaturesCalled]);

  const isTemporalFeature = feature => {
    return COMPARABLE_DATA_TYPES.includes(feature.type.toLowerCase());
  };

  return (
    <div className="dx26-container">
      {loading || updatedFeaturesRequest ? (
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
                {features.map((feature, i) => (
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
                          feature.featureType = selected;
                        }}
                      >
                        {item => <Item key={item.name}>{item.name}</Item>}
                      </Picker>
                    </TableCell>
                    <TableCell align="center">
                      {isTemporalFeature(feature) ? (
                        <Checkbox
                          onChange={() => {
                            feature.dateFilter = feature.dateFilter ? 'DISABLED' : 'ENABLED';
                          }}
                          defaultSelected={feature.dateFilter === 'ENABLED' ? true : false}
                          isEmphasized
                        ></Checkbox>
                      ) : null}
                    </TableCell>
                    <TableCell align="center">
                      {' '}
                      <Checkbox
                        onChange={() => {
                          feature.featureCacheType = feature.featureCacheType ? 'DISABLED' : 'ENABLED';
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
  features: storeState.connections.features,
  loading: storeState.connections.loading,
  isAddFeaturesCalled: storeState.datasourceSteps.isAddFeaturesCalled,
  updatedFeaturesRequest: storeState.connections.updatedFeaturesRequest,
});

const mapDispatchToProps = { getFeatures, addFeatures };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DimensionsMeasures);
