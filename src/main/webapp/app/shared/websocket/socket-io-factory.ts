import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getToken } from 'app/shared/reducers/authentication';
import { NETTY_SOCKET_IO_URL } from 'app/config/constants';

export const useSocket = () => {
  const [socket, setSocket] = useState({ connected: false, disconnected: true, emit: null });
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
    });
    setSocket(s);
    s.on('connect', () => setConnected(true));
    s.on('chat', res => {
      console.log(res);
    });
    return () => {
      s.disconnect();
      console.log('disconnected===' + s.disconnected);
    };
  }, []);

  return { isConnected, sendData };
};
