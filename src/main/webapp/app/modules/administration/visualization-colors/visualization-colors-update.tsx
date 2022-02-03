import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Translate, translate} from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { getEntity, updateEntity, createEntity, reset } from './visualization-colors.reducer';
import { IVisualizationcolors } from 'app/shared/model/visualizationcolors.model';
import { ButtonGroup,  Content, Dialog, Divider,   Form,  Heading, TextField, Button, useDialogContainer } from '@adobe/react-spectrum';


export interface IVisualizationcolorsUpdateProps extends StateProps, DispatchProps {
  visualizationColors?: IVisualizationcolors
}

const VisualizationcolorsUpdate = (props: IVisualizationcolorsUpdateProps) => {
  const [visualizationColorsCode, setVisualizationColors] = useState(props.visualizationColors?.code);
  const dialog = useDialogContainer();

  const saveEntity = () => {
    const values = { code: visualizationColorsCode };
    const entity = {
      ...props.visualizationColors,
      ...values,
    };
    if (props.visualizationColors?.id) {
      props.updateEntity(entity);
    } else {
      props.createEntity(entity);
    }
    dialog.dismiss();
  };

  return (
    <Dialog size="L">
      <Heading>
        <Translate contentKey="visualizationcolors.home.createLabel">Create</Translate>
      </Heading>
      <Divider />
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          <Translate contentKey="entity.action.cancel" >Close</Translate>
        </Button>
        <Button variant="cta" onPress={() => { saveEntity() }} >
          <Translate contentKey="entity.action.save">Save</Translate>
        </Button>
      </ButtonGroup>
      <Content>
        <Form>
          <TextField value={visualizationColorsCode} onChange={setVisualizationColors} label={translate('visualizationcolors.field.code')} placeholder={translate('visualizationcolors.field.code')} autoFocus />
        </Form>
      </Content>

    </Dialog>

  );
};

const mapStateToProps = (storeState: IRootState) => ({
});

const mapDispatchToProps = {
  updateEntity,
  createEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationcolorsUpdate);