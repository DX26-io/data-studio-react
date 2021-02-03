import Stomp from 'stomp-websocket';
import SockJS from 'sockjs-client';

export const create = () => {
  // debug it
  let origin = window.location.origin;
  if (window.location.protocol === 'https') {
    origin = origin.replace('http://', 'https://');
  }
  const connectionUrl = origin + '/' + 'flair-ws';
  console.log('StompClient connectionUrl', connectionUrl);
  const sockClient = new SockJS(connectionUrl);
  const client = Stomp.over(sockClient);
  client.debug = null;
  return client;
};
