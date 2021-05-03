import React, { useEffect } from 'react';
import { disconnectWebSocket } from 'app/shared/websocket/stomp-client.service';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { connect } from 'react-redux';
import { receiveSocketResponse } from 'app/shared/websocket/websocket.reducer';
import { IRootState } from 'app/shared/reducers';

//  this is just for testing websocket connection. remove this file when it's not needed

export interface ITestWebSocketProps extends StateProps, DispatchProps {}

export const TestWebSocket = (props: ITestWebSocketProps) => {
  const sendData = () => {
    const query = {
      queryDTO: { distinct: true, fields: [{ name: 'customer_fname' }] },
      limit: 100,
      vId: '1020',
      type: 'filters',
    };
    forwardCall(503, query, 1020);
  };

  useEffect(() => {
    props.receiveSocketResponse();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <div>
      testing websocket
      <button onClick={sendData}>send Data</button>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  visualData : storeState.visualizationData.visualData
});

const mapDispatchToProps = { receiveSocketResponse };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TestWebSocket);
