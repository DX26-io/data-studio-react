import { sendToWebSocket } from './stomp-client.service';

const sendMsg = (sourceId: number, body: any, viewId: number) => {
  // console.log('sending message', body);
  sendToWebSocket('/flair-ws/fbi-engine-grpc/' + sourceId + '/query/' + viewId, {}, JSON.stringify(body));
};

export const forwardCall = (sourceId: number, body: any, viewId: any) => {
  sendMsg(sourceId, body, viewId);
};
