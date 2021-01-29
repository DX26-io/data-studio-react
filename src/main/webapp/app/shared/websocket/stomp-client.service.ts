import { create } from './stomp-client-factory';

let stompClient;
let messageQueue = [];

// TODO : remove all console logs when done with debugging

const isConnected = () => {
  return stompClient.ws.readyState === 1;
};

const addToMessageQueue = (url, header, body) => {
  console.log('STOMP adding to message queue');
  messageQueue.push({
    url,
    header,
    body,
  });
};

export const sendToWebSocket = (url, header, body) => {
  if (!isConnected()) {
    addToMessageQueue(url, header, body);
  } else {
    console.log('STOMP send', header);
    stompClient.send(url, header, body);
  }
};

const executeQueue = () => {
  if (!isConnected()) {
    return;
  }
  console.log('STOMP executing queue len:', messageQueue.length);
  const localMessageQueue = messageQueue.concat();
  messageQueue = [];
  localMessageQueue.forEach(function (message) {
    sendToWebSocket(message.url, message.header, message.body);
  });
};

export const subscribeWebSocket = (url, handler) => {
  console.log('STOMP subscribe');
  stompClient.subscribe(url, function (data) {
    console.log('STOMP subscribed handler');
    handler(data);
  });
};

const createStompClient = () => {
  return create();
};

export const connectWebSocket = (params, connectionHandler) => {
  stompClient = createStompClient();
  console.log('STOMP connect', stompClient);
  stompClient.connect(params, function (data) {
    console.log('STOMP connected handler');
    connectionHandler(data);
    executeQueue();
  });
};

export const disconnectWebSocket = () => {
  console.log('STOMP disconnect');
  stompClient.disconnect();
};
