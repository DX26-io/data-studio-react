import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from './visualizations.reducer';
import { IVisualMetadata } from 'app/shared/model/visual-meta-data.model';
import { Button, ButtonGroup, Content, Dialog, DialogContainer, Divider, Form, Heading, TextField } from '@adobe/react-spectrum';

export interface IVisualizationsProps extends StateProps, DispatchProps {}

export const Visualizations = (props: IVisualizationsProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { visualizationsList, loading } = props;
  return (
    !props.loading && (
      <>
        <DialogContainer type="modal" onDismiss={null}>
          <Dialog>
            <Heading>Visualizations</Heading>
            <Divider />
            <Content>
              {visualizationsList &&
                visualizationsList.length > 0 &&
                visualizationsList.map((visualizations, i) => <p key={i}>{visualizations.name}</p>)}
            </Content>
            <ButtonGroup>
              <Button variant="secondary">Cancel</Button>
              <Button variant="cta">Select</Button>
            </ButtonGroup>
          </Dialog>
        </DialogContainer>
      </>
    )
  );
};

const mapStateToProps = ({ visualizations }: IRootState) => ({
  visualizationsList: visualizations.entities,
  loading: visualizations.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Visualizations);
