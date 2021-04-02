import React from 'react';
import Connections, { IConnectionsProps } from 'app/modules/administration/sources/connections/connections';
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
    Sources: {
      connections: [],
      totalItems: 0,
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
        connectionUsername: 'postgres',
        connectionPassword: 'admin',
        connectionTypeId: 1,
        linkId: '1715917d-fff8-44a1-af02-ee2cd41a3609',
        realmId: 0,
        details: {
          databaseName: 'services',
          type: 'Postgres',
          serverIp: 'flair-pgsql',
          serverPort: '5432',
        },
        connectionParameters: {},
      },
      {
        id: 2,
        name: 'Mysql-connection',
        connectionUsername: 'root',
        connectionPassword: 'admin',
        connectionTypeId: 2,
        linkId: '7bbdbca5-b704-4d78-9ad4-0d3e2458ee5f',
        realmId: 0,
        details: {
          databaseName: 'services',
          type: 'MySql',
          serverIp: 'localhost',
          serverPort: '3306',
        },
        connectionParameters: {},
      },
      {
        id: 3,
        name: 'Oracle-connection',
        connectionUsername: 'system',
        connectionPassword: 'oracle',
        connectionTypeId: 3,
        linkId: '58373090-6dbc-4635-b0ad-2c37c863b260',
        realmId: 0,
        details: {
          databaseName: 'xe',
          type: 'Oracle',
          serverIp: 'localhost',
          serviceName: 'xe',
          serverPort: '1521',
        },
        connectionParameters: {},
      },
      {
        id: 4,
        name: 'Cockroachdb-connection',
        connectionUsername: 'postgres',
        connectionPassword: 'admin',
        connectionTypeId: 6,
        linkId: '1715917d-fff8-44a1-af02-ee2cd41a3611',
        realmId: 0,
        details: {
          databaseName: 'services',
          type: 'Cockroachdb',
          serverIp: 'localhost',
          serverPort: '26257',
        },
        connectionParameters: {},
      },
      {
        id: 5,
        name: 'Redshift-connection',
        connectionUsername: 'vizcentric',
        connectionPassword: 'Jengar1952',
        connectionTypeId: 7,
        linkId: '1715917d-fff8-44a1-af02-ee2cd41a3610',
        realmId: 0,
        details: {
          databaseName: 'flairbi',
          type: 'Redshift',
          serverIp: 'flairbi-rs-instance.c0kvqfcudxql.eu-west-1.redshift.amazonaws.com',
          serverPort: '5439',
        },
        connectionParameters: {},
      },
      {
        id: 6,
        name: 'Athena-connection',
        connectionUsername: 'AKIAIBB4R46GJFLOZHJA',
        connectionPassword: 'h6bhUXgjYB1gEa7KpU5WTbisx5Yt3Wp2+d/AuM96',
        connectionTypeId: 8,
        linkId: '1715917d-fff8-44a1-af02-ee2cd41a3123',
        realmId: 0,
        details: {
          workgroup: 'athena-wg',
          databaseName: 'centricdb',
          type: 'Athena',
          serverIp: 'athena.eu-west-1.amazonaws.com',
          s3OutputLocation: 's3://aws-athena-query-results-689779572241-eu-west-1/',
          serverPort: '443',
        },
        connectionParameters: {},
      },
      {
        id: 7,
        name: 'Kafka-connection',
        connectionUsername: 'postgres',
        connectionPassword: 'admin',
        connectionTypeId: 9,
        linkId: '1715917d-fff8-44a1-af02-ee2cd41a3010',
        realmId: 0,
        details: {
          type: 'Kafka',
          isSecure: 'false',
          serverIp: 'localhost',
          serverPort: '8088',
        },
        connectionParameters: {},
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
