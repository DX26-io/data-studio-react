import { send } from 'app/modules/canvas/visualization/util/stomp-client';

const sendMsg = (sourceId, body, viewId) => {
  // console.log('sending message', body);
  send('/flair-ws/fbi-engine-grpc/' + sourceId + '/query/' + viewId, {}, JSON.stringify(body));
};

const sendMsgV2 = (sourceId, body) => {
  // console.log('sending message', body);
  send('/flair-ws/fbi-engine-grpc/' + sourceId + '/query', {}, JSON.stringify(body));
};

export const forwardCall = (sourceId, body, viewId) => {
  sendMsg(sourceId, body, viewId);
};

const forwardCallV2 = (sourceId, body) => {
  sendMsgV2(sourceId, body);
};

const queryAll = body => {
  send('/flair-ws/fbi-engine-grpc/queryAll', {}, JSON.stringify(body));
};

const getSchedulerReportsAndEngineData = (pageSize, page) => {
  //  send('/flair-ws/fbi-engine-grpc/scheduled-reports/' + pageSize + '/' + page, {});
};
