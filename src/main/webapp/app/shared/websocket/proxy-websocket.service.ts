import { sendToWebSocket } from './stomp-client.service';

const sendMsg = (sourceId: number, body: any, viewId?: number) => {
  // console.log('sending message', body);
  if (viewId) {
    sendToWebSocket('/flair-ws/fbi-engine-grpc/' + sourceId + '/query/' + viewId, {}, JSON.stringify(body));
  } else {
    sendToWebSocket('/flair-ws/fbi-engine-grpc/' + sourceId + '/query', {}, JSON.stringify(body));
  }
};

export const forwardCall = (sourceId: number, body: any, viewId: any) => {
  sendMsg(sourceId, body, viewId);
};

export const searchCall = (viewId: any, body: any) => {
  sendToWebSocket(`/flair-ws/view/${viewId}/search`, {}, JSON.stringify(body));
};

export const searchItemSelected = (viewId: any, body: any) => {
  sendToWebSocket(`/flair-ws/view/${viewId}/search-item-selected`, {}, JSON.stringify(body));
};
