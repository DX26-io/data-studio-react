import React, { useState, useRef, useEffect } from 'react';
import { Dialog, Heading, Divider, Content, ButtonGroup, Button, useDialogContainer, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Translate } from 'react-jhipster';
import TableView from 'app/shared/components/table/table';
import { CSVLink } from 'react-csv';
import { getTransactionData } from '../../util/visualisation-utils';

export interface IVisualisationDataModalProps {
  visual: any;
}

export const VisualisationDataModal = (props: IVisualisationDataModalProps) => {
  const dialog = useDialogContainer();
  const [transactionData, setTransactionData] = useState([]);
  const csvLink = useRef(null);

  const handleClose = () => {
    dialog.dismiss();
  };

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
        <Button variant="cta" onPress={() => getTransactionData(props.visual.data, csvLink, setTransactionData)}>
          Export
        </Button>
        <Button variant="secondary" onPress={() => handleClose()}>
          <Translate contentKey="entity.action.cancel">Close</Translate>
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

export default visualisationDataModal;
