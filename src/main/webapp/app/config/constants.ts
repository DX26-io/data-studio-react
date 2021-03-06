const config = {
  VERSION: process.env.VERSION,
  CLOUD: false,
};

export default config;

export const SERVER_API_URL = process.env.SERVER_API_URL;

export const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
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

// TODO : transalte component does not work with picker
// export const SEPARATORS = [
//   {
//     id: ',',
//     name: 'separators.comma',
//   },
//   {
//     id: ' ',
//     name: 'separators.space',
//   },
//   {
//     id: '|',
//     name: 'separators.pipe',
//   },
//   {
//     id: ':',
//     name: 'separators.colon',
//   },
// ];

export const SEPARATORS = [
  {
    name: 'Data Separator Comma[,]',
    id: ',',
  },
  {
    name: 'Data Separator Space[]',
    id: ' ',
  },
  {
    name: 'Data Separator Pipe[|]',
    id: '|',
  },
  {
    name: 'Data Separator Colon[:]',
    id: ':',
  },
];
