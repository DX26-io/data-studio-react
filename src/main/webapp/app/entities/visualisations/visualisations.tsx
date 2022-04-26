import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from './visualisations.reducer';
import { IVisualMetadata } from 'app/shared/model/visualmetadata.model';
import { Button, ButtonGroup, Content, Dialog, DialogContainer, Divider, Form, Heading, TextField } from '@adobe/react-spectrum';

export interface IVisualisationsProps extends StateProps, DispatchProps {}

export const Visualisations = (props: IVisualisationsProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { visualisationsList, loading } = props;
  return (
    !props.loading && (
      <>
        <DialogContainer type="modal" onDismiss={null}>
          <Dialog>
            <Heading>visualisations</Heading>
            <Divider />
            <Content>
              {visualisationsList &&
                visualisationsList.length > 0 &&
                visualisationsList.map((visualisations, i) => <p key={i}>{visualisations.name}</p>)}
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

const mapStateToProps = ({ visualisations }: IRootState) => ({
  visualisationsList: visualisations.entities,
  loading: visualisations.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Visualisations);
