export const COMPARABLE_DATA_TYPES = ['timestamp', 'date', 'datetime'];

export const CONDITION_TYPES = [
  {
    displayName: 'Or',
    '@type': 'Or',
    type: 'composite',
  },
  {
    displayName: 'Between',
    '@type': 'Between',
    type: 'simple',
  },
  {
    displayName: 'Compare',
    '@type': 'Compare',
    type: 'simple',
  },
  {
    displayName: 'And',
    '@type': 'And',
    type: 'composite',
  },
  {
    displayName: 'Contains',
    '@type': 'Contains',
    type: 'simple',
  },
  {
    displayName: 'Not Contains',
    '@type': 'NotContains',
    type: 'simple',
  },
  {
    displayName: 'Like',
    '@type': 'Like',
    type: 'simple',
  },
];

export const COMPARE_TYPES = [
  {
    displayName: '==',
    value: 'EQ',
  },
  {
    displayName: '!=',
    value: 'NEQ',
  },
  {
    displayName: '>=',
    value: 'GTE',
  },
  {
    displayName: '<=',
    value: 'LTE',
  },
  {
    displayName: '>',
    value: 'GT',
  },
  {
    displayName: '<',
    value: 'LT',
  },
];

export const FILTER_TYPES = {
  BASE: 'BASE',
  FILTER: 'FILTER',
  REDUCTION: 'REDUCTION',
};

export const SIMPLE_DATE_TYPES_FOR_DATES = ['Between', 'Compare'];
export const SIMPLE_DATE_TYPES_OTHER = ['Compare', 'Contains', 'NotContains', 'Like'];

export const DYNAMIC_DATE_RANGE_CONFIG = [
  {
    title: 'Last 7 days',
    period: {
      months: 0,
      days: 7,
    },
  },
  {
    title: 'Last 30 days',
    period: {
      months: 1,
      days: 0,
    },
  },
  {
    title: 'Last 90 days',
    period: {
      months: 3,
      days: 0,
    },
  },
  {
    title: 'Last 365 days',
    period: {
      months: 12,
      days: 0,
    },
  },
  {
    title: 'Week to date',
    toDate: 'isoWeek',
  },
  {
    title: 'Month to date',
    toDate: 'month',
  },
  {
    title: 'Quarter to date',
    toDate: 'quarter',
  },
  {
    title: 'Year to date',
    toDate: 'year',
  },
  {
    title: 'Custom X days',
    isCustom: true,
    unit: 'days',
    startDay: true,
    startDayUnit: 'day',
  },
  {
    title: 'Custom X hours',
    isCustom: true,
    unit: 'hours',
    startDay: false,
  },
];

export const tabList = [
  {
    id: '0',
    name: 'Day',
  },
  {
    id: '1',
    name: 'Range',
  },
  {
    id: '2',
    name: 'Dynamic',
  },
];

export const COMPARISIONS = [
  { value: 'EQ', label: 'Equal' },
  { value: 'NEQ', label: 'Not Equal' },
  { value: 'GT', label: 'Greater Than' },
  { value: 'LT', label: 'Less Than' },
  { value: 'GTE', label: 'Greater Than or Equal To' },
  { value: 'LTE', label: 'Less Than or Equal To' },
];

export const AGGREGATION_TYPES = [
  { value: 'SUM', label: 'Sum' },
  { value: 'AVG', label: 'Average' },
];

export const TIME_UNIT = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
];
