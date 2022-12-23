import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getToken } from 'app/shared/reducers/authentication';
import { NETTY_SOCKET_IO_URL, FILTERS, VISUALISATION, SHARED_LINK_FILTER } from 'app/config/constants';
import { setFilterData, setVisualData, setVisualDataById } from './websocket.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../reducers';

export const useSocket = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState({ connected: false, disconnected: true, emit: null });
  const [isConnected, setConnected] = useState(false);
  const account = useSelector((storeState: IRootState) => storeState.authentication.account);
  const sendEvent = useCallback(
    (fbiEngineDTO: any, datasourceId: number, viewId?) => {
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
    s.on('connect', () => {
      setConnected(true);
      // console.log('connected to socket');
    });
    s.on(FILTERS.concat(account.login), response => {
      // console.log(response);
      const res = response === '' ? { data: [] } : JSON.parse(response.data);
      dispatch(setFilterData(res.data));
    });
    s.on(SHARED_LINK_FILTER.concat(account.login), response => {
      // console.log(response);
      const res = response === '' ? { data: [] } : JSON.parse(response.data);
      dispatch(setVisualDataById(res.data));
    });
    s.on(VISUALISATION.concat(account.login), response => {
      // console.log(response);
      const visualData = { data: [], queryId: '' };
      const res = response === '' ? { data: [] } : JSON.parse(response.data);
      visualData.data = res.data;
      visualData.queryId = response.queryId;
      dispatch(setVisualData(visualData));
    });
    return () => {
      // console.log('disconnected===' + s.disconnected);
      s.disconnect();
    };
  }, []);

  return { isConnected, sendEvent };
};
