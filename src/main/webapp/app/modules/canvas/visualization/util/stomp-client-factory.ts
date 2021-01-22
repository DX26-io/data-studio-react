// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';

// const url = 'http://localhost:8200/flair-ws';
// export const create = () => {
//   const connectionUrl = url;
//   // console.log('StompClient connectionUrl', connectionUrl);
//   const sockClient = new SockJS(connectionUrl);
//   const client = Stomp.over(sockClient);
//   client.debug = null;
//   return client;
// };
import io from 'socket.io-client';

export const create = token => {
  const socket = io('ws://localhost:8002/flair-ws', {
    transport: ['websocket'],
    reconnectionDelayMax: 10000,
    auth: {
      token,
    },
  });
  return socket;
};
