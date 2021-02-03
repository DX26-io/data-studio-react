import { sendToWebSocket } from './stomp-client.service';

const sendMsg = (sourceId, body, viewId) => {
  // console.log('sending message', body);
  sendToWebSocket('/flair-ws/fbi-engine-grpc/' + sourceId + '/query/' + viewId, {}, JSON.stringify(body));
};

export const forwardCall = (sourceId, body, viewId) => {
  sendMsg(sourceId, body, viewId);
};
