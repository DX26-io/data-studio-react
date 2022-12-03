import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getToken } from 'app/shared/reducers/authentication';

export const useSocket = (userName, message) => {
  const [socket, setSocket] = useState({ connected: false, disconnected: true, emit: null });
  const [socketResponse, setSocketResponse] = useState({
    userName: '',
    message: '',
  });
  const [isConnected, setConnected] = useState(false);
  const sendData = useCallback(
    payload => {
      socket.emit('chat', {
        message: payload.message,
        userName: payload.userName,
        actionTime: new Date(),
      });
    },
    [socket]
  );
  useEffect(() => {
    const s = io('http://localhost:8085/chat', {
      reconnection: false,
      transports: ['polling', 'websocket'],
      path: '/dx26io-ws',
      query: {
        token: getToken(),
      },
      // extraHeaders: {
      //   Authorization: 'Bearer ' + getToken(),
      // },
    });
    setSocket(s);
    s.on('connect', () => setConnected(true));
    s.on('chat', res => {
      console.log(res);
      setSocketResponse({
        userName: res.userName,
        message: res.message,
        // createdDateTime: res.createdDateTime,
      });
    });
    return () => {
      s.disconnect();
    };
  }, []);

  return { socketResponse, isConnected, sendData };
};
