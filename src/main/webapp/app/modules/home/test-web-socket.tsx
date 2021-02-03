import React, { useEffect } from 'react';

import { getToken } from 'app/shared/reducers/authentication';
import { connectWebSocket, subscribeWebSocket, disconnectWebSocket } from 'app/shared/websocket/stomp-client.service';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';

//  this is just for testing websocket connection. remove this file when it's not needed

export const TestWebSocket = () => {

  const onExchangeMetadataError = data => {
    const body = JSON.parse(data.body || '{}');
    console.log("received data="+body);
    console.log("received error="+body);
  };
  
  const onExchangeMetadata = data => {
    const metaData = data.body === '' ? { data: [] } : JSON.parse(data.body);
    console.log("received data="+metaData);
  };


  const connectWeb = () => {
    connectWebSocket({ token: getToken() }, function (frame) {
      console.log(' connected web socket');
      subscribeWebSocket('/user/exchange/metaData', onExchangeMetadata);
      subscribeWebSocket('/user/exchange/metaDataError', onExchangeMetadataError);
    });
  };

  const sendData = () => {
    // "{"queryDTO":{"fields":[{"name":"customer_lname"}],"distinct":true,"limit":100},"vId":"1004","type":"filters"}"
    const query = {
      queryDTO: { distinct: true, fields: [{ name: 'customer_fname' }] },
      limit: 100,
      vId: '1004',
      type: 'filters',
    };
    forwardCall(503, query, 1004);
  };

  useEffect(() => {
    connectWeb();
    return () => {
      disconnectWebSocket();
      console.log("cleaned up");
    };
  }, []);

  return (
    <div>
      testing websocket
      <button onClick={sendData}>send Data</button>
    </div>
  );
};

export default TestWebSocket;
