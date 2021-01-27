import { create } from 'app/modules/canvas/visualization/util/stomp-client-factory';

let stompClient;
const messageQueue = [];

const isConnected = () => {
  return stompClient?.ws?.readyState === 1;
};

const addToMessageQueue = (url, header, body) => {
  // console.log('STOMP adding to message queue');
  messageQueue.push({
    url,
    header,
    body,
  });
};

export const send = (url, header, body) => {
  if (!isConnected()) {
    addToMessageQueue(url, header, body);
  } else {
    console.log('STOMP send', header);
    stompClient.send(url, header, body);
  }
};

export const subscribe = (url, handler) => {
  // console.log('STOMP subscribe');
  stompClient.subscribe(url, function (data) {
    // console.log('STOMP subscribed handler');
    handler(data);
  });
};

const createStompClient = () => {
  return create();
};

const executeQueue = () => {
  if (!isConnected()) {
    return;
  }
  // console.log('STOMP executing queue len:', messageQueue.length);

  const localMessageQueue = messageQueue.concat();
  localMessageQueue.forEach(item => {
    const message = item;
    send(message.url, message.header, message.body);
  });
};

export const connect = (params, connectionHandler) => {
  stompClient = createStompClient();
  // console.log('STOMP connect', stompClient);
  stompClient.connect(params, data => {
    console.log('STOMP connected handler');
    connectionHandler(data);
    executeQueue();
  });
};

export const disconnect = () => {
  // console.log('STOMP disconnect');
  stompClient.disconnect();
};
