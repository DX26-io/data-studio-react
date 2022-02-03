import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { deleteEntity } from './visualization-colors.reducer';
import { ButtonGroup, Content, Dialog, Divider, Heading, Button, useDialogContainer } from '@adobe/react-spectrum';


export interface IVisualizationcolorsUpdateProps extends StateProps, DispatchProps {
  id?: number
}

const VisualizationcolorsDelete = (props: IVisualizationcolorsUpdateProps) => {
  const dialog = useDialogContainer();
  
  return (
    <Dialog size="L">
      <Heading>
          Delete
      </Heading>
      <Divider />
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="entity.action.cancel" >Cancel</Translate>
        </Button>
        <Button variant="cta" onPress={() =>  props.deleteEntity(props.id)} >
          <Translate contentKey="entity.action.delete">delete</Translate>
        </Button>
      </ButtonGroup>
      <Content>
      Are you sure you want to delete this Visualizationcolor?
      </Content>
    </Dialog>

  );
};

const mapStateToProps = (storeState: IRootState) => ({
 });

const mapDispatchToProps = {
  deleteEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationcolorsDelete);