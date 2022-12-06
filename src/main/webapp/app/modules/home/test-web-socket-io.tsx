import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { receiveSocketResponse } from 'app/shared/websocket/websocket.reducer';
import { IRootState } from 'app/shared/reducers';
import { useSocket } from 'app/shared/websocket/socket-io-factory';

//  this is just for testing websocket connection. remove this file when it's not needed

export interface ITestWebSocketProps extends StateProps, DispatchProps {}

export const TestWebSocketIO = (props: ITestWebSocketProps) => {
  const { send } = useSocket();

  const sendQueryDTO = () => {
    const query = {
      queryDTO: { distinct: true, fields: [{ name: 'country' }] },
      limit: 100,
      vId: '1020',
      type: 'filters',
    };
    send(query,50100,1035);
  };

  return (
    <div>
      testing websocket
      <button onClick={sendQueryDTO}>send Data</button>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualData: storeState.visualisationData.visualData,
});

const mapDispatchToProps = { receiveSocketResponse };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TestWebSocketIO);
