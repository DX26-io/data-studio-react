import { DATE, DATETIME } from 'app/shared/util/date-utils';
import moment from 'moment';

export const resetTimezone = date => {
  if (!date) {
    return null;
  }
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date;
};

export const resetTimezoneData = startDate => {
  return startDate;
};

export const strToDate = date => {
  if (!date) {
    return null;
  }
  return Date.parse(date) ? new Date(date) : null;
};

export const endOfDay = date => {
  if (!date) {
    return null;
  }
  date.setHours(23, 59, 59);
  return date;
};

export const startOfDay = date => {
  if (!date) {
    return null;
  }
  date.setHours(0, 0, 0);
  return date;
};

export const dateToString = date => {
  return moment(date).utc().format(DATETIME);
};

export const formatDate = date => {
  if (!date) {
    return null;
  }
  return dateToString(date);
};

export const stringToDate = date => {
  return moment(date).format(DATE).toString();
};

export const getStartDateRangeInterval = (config, customDynamicDateRange) => {
  if (!config) {
    return null;
  }
  if (config.toDate) {
    return null;
  } else if (config.isCustom) {
    return customDynamicDateRange + ' ' + config.unit;
  } else if (config.period.days) {
    return config.period.days + ' days';
  } else if (config.period.months) {
    return config.period.months + ' months';
  }
  return null;
};

export const getStartDateRangeTimeUnit = config => {
  if (!config) {
    return null;
  }
  if (config.toDate) {
    return null;
  } else if (config.isCustom && config.startDay) {
    return "'" + config.startDayUnit + "'";
  }
  return null;
};

export const adjustStartDateRangeInterval = config => {
  if (!config) {
    return null;
  }
  if (config.toDate || config.isCustom) {
    return null;
  } else if (config.period.days || config.period.months) {
    const toDate = moment(new Date()).subtract(config.period.days, 'days').subtract(config.period.months, 'months').toDate();
    return toDate;
  }
  return null;
};

export const getStartDateRange = config => {
  let date = new Date();
  if (!config) {
    return null;
  }
  if (config.toDate) {
    date = moment(date).startOf(config.toDate).toDate();
    return date;
  }
  return null;
};

// export const getStartDateRange = config => {
//   let date = new Date();
//   if (!config) {
//     return null;
//   }
//   if (config.toDate) {
//     date = moment(date).startOf(config.toDate).toDate();
//     return date;
//   }
//   return null;
// };
