import { sendToWebSocket } from './stomp-client.service';

const sendMsg = (sourceId: number, body: any, viewId?: number) => {
  // console.log('sending message', body);
  if (viewId) {
    sendToWebSocket('/flair-ws/fbi-engine-grpc/' + sourceId + '/query/' + viewId, {}, JSON.stringify(body));
  } else {
    sendToWebSocket('/flair-ws/fbi-engine-grpc/' + sourceId + '/query', {}, JSON.stringify(body));
  }
};

export const forwardCall = (sourceId: number, body: any, viewId?: number) => {
  sendMsg(sourceId, body, viewId);
};
