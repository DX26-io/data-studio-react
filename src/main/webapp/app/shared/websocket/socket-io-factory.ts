import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getToken } from 'app/shared/reducers/authentication';
import { NETTY_SOCKET_IO_URL } from 'app/config/constants';

export const useSocket = () => {
  const [socket, setSocket] = useState({ connected: false, disconnected: true, emit: null });
  const [isConnected, setConnected] = useState(false);
  const send = useCallback(
    (fbiEngineDTO, datasourceId, viewId) => {
      socket.emit('query', {
        fbiEngineDTO,
        datasourceId,
        viewId,
      });
    },
    [socket]
  );
  useEffect(() => {
    const s = io(`${NETTY_SOCKET_IO_URL}/query`, {
      reconnection: false,
      transports: ['websocket'],
      path: '/dx26io-ws',
      query: {
        token: getToken(),
      },
    });
    setSocket(s);
    s.on('connect', () => setConnected(true));
    s.on('query', res => {
      // console.log(res);
    });
    return () => {
      s.disconnect();
      // console.log('disconnected===' + s.disconnected);
    };
  }, []);

  return { isConnected, send };
};
