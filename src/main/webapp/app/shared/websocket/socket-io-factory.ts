import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getToken } from 'app/shared/reducers/authentication';
import { NETTY_SOCKET_IO_URL, FILTERS, VISUALISATION, SHARED_LINK_FILTER } from 'app/config/constants';
import { setFilterData, setVisualData, setVisualDataById } from './websocket.reducer';
import { useDispatch } from 'react-redux';

export const useSocket = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState({ connected: false, disconnected: true, emit: null });
  const [isConnected, setConnected] = useState(false);
  const send = useCallback(
    (fbiEngineDTO, datasourceId, viewId?) => {
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
    s.on(FILTERS, response => {
      // console.log(response);
      const res = response === '' ? { data: [] } : JSON.parse(response.data);
      dispatch(setFilterData(res.data));
    });
    s.on(SHARED_LINK_FILTER, response => {
      // console.log(response);
      const res = response === '' ? { data: [] } : JSON.parse(response.data);
      dispatch(setVisualData(res.data));
    });
    s.on(VISUALISATION, response => {
      // console.log(response);
      const res = response === '' ? { data: [] } : JSON.parse(response.data);
      dispatch(setVisualDataById(res.data));
    });
    return () => {
      // console.log('disconnected===' + s.disconnected);
      s.disconnect();
    };
  }, []);

  return { isConnected, send };
};
