const config = {
  VERSION: process.env.VERSION,
  CLOUD: false,
};

export default config;

export const SERVER_API_URL = process.env.SERVER_API_URL;
export const NETTY_SOCKET_IO_URL = process.env.NETTY_SOCKET_IO_URL;

export const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
};

export const messages = {
  DATA_ERROR_ALERT: 'Internal Error',
};

export const COMPARABLE_DATA_TYPES = ['timestamp', 'date', 'datetime'];

export const APP_DATE_FORMAT = 'DD/MM/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm Z';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';

export const CONSTRAINT_TYPES = ['Inclusion', 'Exclusion'];
export const ORGANISATION_TYPE_ENTERPRISE = 'enterprise';
export const ORGANISATION_TYPE_FULL = 'full';

export const FILTERS = 'filters';

export const VISUALISATION = 'visualisation';

export const SHARED_LINK_FILTER = 'share-link-filter';
