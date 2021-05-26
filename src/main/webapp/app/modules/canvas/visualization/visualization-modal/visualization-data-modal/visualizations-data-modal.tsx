import React, { useState, useRef, useEffect } from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, useDialogContainer, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import TableView from 'app/shared/components/table/table';
import { CSVLink } from 'react-csv';

export interface IVisualizationDataModalProps {
  visual: any;
}

export const VisualizationDataModal = (props: IVisualizationDataModalProps) => {
  const dialog = useDialogContainer();
  const [transactionData, setTransactionData] = useState([]);
  const csvLink = useRef(null);

  const handleClose = () => {
    dialog.dismiss();
  };

  const getTransactionData = () => {
    setTransactionData(props.visual.data);
    csvLink.current.link.click();
  };
  
  // TODO : commented it for now
  // const getTransactionData = async () => {
  //   setTransactionData(props.visual.data);
  //   csvLink.current.link.click();
  // };

  return (
    <Dialog>
      <Heading level={4}>{props.visual?.titleProperties?.titleText}</Heading>
      <Divider />
      <Content>
        <View>{props.visual.data && props.visual.data.length > 0 && <TableView data={props.visual.data} />}</View>
        <CSVLink
          data={transactionData}
          filename={`${props.visual?.titleProperties?.titleText}.csv`}
          className="hidden"
          ref={csvLink}
          target="_blank"
        />
      </Content>
      <ButtonGroup>
        <Button variant="cta" onPress={() => getTransactionData()}>
          Export
        </Button>
        <Button variant="secondary" onPress={() => handleClose()}>
          <Translate contentKey="entity.action.cancel">Close</Translate>
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

export default VisualizationDataModal;
