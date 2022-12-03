import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getToken } from 'app/shared/reducers/authentication';
import { NETTY_SOCKET_IO_URL } from 'app/config/constants';

export const useSocket = () => {
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
    const s = io(`${NETTY_SOCKET_IO_URL}/chat`, {
      reconnection: false,
      transports: ['websocket'],
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
      });
    });
    return () => {
      s.disconnect();
    };
  }, []);

  return { socketResponse, isConnected, sendData };
};
