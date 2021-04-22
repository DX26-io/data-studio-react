import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { resetUpdateError, createDatasourceWithAction } from '../../datasources.reducer';
import { Flex, Dialog, Heading, Divider, Content, Button, Header, useDialogContainer } from '@adobe/react-spectrum';
import { IDatasources } from 'app/shared/model/datasources.model';

interface IDuplicateDatasourceDialogProps extends DispatchProps {
  datasource: IDatasources;
}

export const DuplicateDatasourceDialog = (props: IDuplicateDatasourceDialogProps) => {
  const dialog = useDialogContainer();

  const { datasource } = props;

  return (
    <Dialog data-testid="duplicate-datasource-dialog" size="S">
      <Heading>
        <Flex alignItems="center" gap="size-100">
          <Translate contentKey="datasources.exploreDataModel.duplicateDatasource">Sample Data</Translate>
        </Flex>
      </Heading>
      <Header>
        <Flex alignItems="center" gap="size-100">
          <Button
            variant="secondary"
            onPress={() => {
              dialog.dismiss();
              props.resetUpdateError();
            }}
          >
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
        </Flex>
      </Header>
      <Divider />
      <Content>
        <span className="spectrum-Body-emphasis" style={{ verticalAlign: '6px', marginLeft: '5px' }}>
          {translate('datasources.exploreDataModel.duplicateDatasourceAlert', { datasourceName: datasource.name })}
        </span>
        <Flex alignItems="end" gap="size-100" justifyContent="end">
          <Button
            variant="negative"
            onPress={() => {
              dialog.dismiss();
              props.createDatasourceWithAction(datasource, 'DELETE');
            }}
          >
            <Translate contentKey="entity.action.delete">Cancel</Translate>
          </Button>
          <Button
            variant="cta"
            onPress={() => {
              dialog.dismiss();
              props.createDatasourceWithAction(datasource, 'EDIT');
            }}
          >
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </Button>
        </Flex>
      </Content>
    </Dialog>
  );
};

const mapDispatchToProps = { resetUpdateError, createDatasourceWithAction };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(DuplicateDatasourceDialog);
