import React, { useEffect } from 'react';

import { getToken } from 'app/shared/reducers/authentication';
import { connectWebSocket } from 'app/shared/websocket/stomp-client.service';

/*** this is just for testing websocket connection. remove this file when it's not needed*/
export const TestWebSocket = () => {
  const connectWeb = () => {
    connectWebSocket({ token: getToken() }, function (frame) {
      console.log(' connected web socket');
    });
  };

  useEffect(() => {
    connectWeb();
  }, []);

  return <div>testing websocket</div>;
};

export default TestWebSocket;
