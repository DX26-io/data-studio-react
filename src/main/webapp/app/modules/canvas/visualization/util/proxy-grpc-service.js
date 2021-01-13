const forwardCall = (sourceId, body, viewId) => {
  sendMsg(sourceId, body, viewId);
};

const forwardCallV2 = (sourceId, body) => {
  sendMsgV2(sourceId, body);
};

const sendMsg = (sourceId, body, viewId) => {
  console.log('sending message', body);
  stompClientService.send('/flair-ws/fbi-engine-grpc/' + sourceId + '/query/' + viewId, {}, JSON.stringify(body));
};

const sendMsgV2 = (sourceId, body) => {
  console.log('sending message', body);
  stompClientService.send('/flair-ws/fbi-engine-grpc/' + sourceId + '/query', {}, JSON.stringify(body));
};

const queryAll = body => {
  stompClientService.send('/flair-ws/fbi-engine-grpc/queryAll', {}, JSON.stringify(body));
};

const getSchedulerReportsAndEngineData = (pageSize, page) => {
  stompClientService.send('/flair-ws/fbi-engine-grpc/scheduled-reports/' + pageSize + '/' + page, {});
};

export const proxyGrpcService = () => {
  return {
    forwardCall: forwardCall,
    forwardCallV2: forwardCallV2,
    queryAll: queryAll,
    getSchedulerReportsAndEngineData: getSchedulerReportsAndEngineData,
  };
};
