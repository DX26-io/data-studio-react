import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { useSocket } from 'app/shared/websocket/socket-io-factory';

//  this is just for testing websocket connection. remove this file when it's not needed

export const TestWebSocketIO = () => {
  const { sendEvent } = useSocket();

  const sendEventQueryDTO = () => {
    const query = {
      queryDTO: { distinct: true, fields: [{ name: 'country' }] },
      limit: 100,
      vId: '1020',
      type: 'filters',
    };
    sendEvent(query, 50100, 1035);
  };

  return (
    <div>
      testing websocket
      <button onClick={sendEventQueryDTO}>send Data</button>
    </div>
  );
};
