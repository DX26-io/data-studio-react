import React from 'react';
import  { Connections,IConnectionsProps } from 'app/modules/administration/sources/connections/connections';
import userEvent from '@testing-library/user-event';
import { DialogContainer, defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { MemoryRouter } from 'react-router';

export const getInitialState = () => {
  return {
    connections: {
      connections: [],
    },
  };
};

describe('Connections', () => {
  let mountedWrapper;

  const connectionsProps = {
    history: { push: jest.fn() } as any,
    location: {} as any,
    match: {} as any,
    connections: [
      {
        id: 1,
        name: 'Postgres-connection',
        connectionUsername: 'test',
        connectionPassword: 'test',
        connectionTypeId: 1,
        linkId: '1715917d-fff8-44a1-af02-ee2cd41a3609',
        realmId: 0,
        details: {
          databaseName: 'services',
          type: 'Postgres',
          serverIp: 'flair-pgsql',
          serverPort: '5432',
        },
        connectionParameters: { cacheEnabled: 'false', cachePurgeAfterMinutes: '0', refreshAfterMinutes: '0', refreshAfterTimesRead: '0' },
      },
    ],
    getConnections: jest.fn(),
  };

  const wrapper = (props: IConnectionsProps) => {
    const mockStore = configureMockStore([thunk, promiseMiddleware]);
    const store = mockStore(getInitialState());
    if (!mountedWrapper) {
      mountedWrapper = render(
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
            <MemoryRouter>
              <Connections {...props} {...connectionsProps} />
            </MemoryRouter>
          </Provider>
        </SpectrumProvider>
      );
    }
    return mountedWrapper;
  };

  beforeEach(() => {
    mountedWrapper = undefined;
  });

  it('should render connections', () => {
    const tree = wrapper(null);
    expect(tree).toBeDefined();
    expect(connectionsProps.getConnections.mock.calls.length).toEqual(1);
  });
});
