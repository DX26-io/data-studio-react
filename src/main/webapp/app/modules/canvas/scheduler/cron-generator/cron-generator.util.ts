/** {{{ Convert a list of values to cron-syntax
 * @param bool zeroAllowed  weather the number zero is allowed (true) or not
 *                          (false)
 * @param  int              max the maximum value (eg. 59 for minutes)
 * @param  int[]            values a list of selected values
 * @return string
 */
const cronCalculate = (zeroAllowed, max, values) => {
  if (zeroAllowed === false) values.push(0);
  if (values.length > max || values.length === 0) return '*';
  values.sort(function (a, b) {
    return a - b;
  });
  // eslint-disable-next-line
  out: for (let d = 2; d <= Math.ceil(max / 2); d++) {
    const tmp = values.slice();
    for (let x = 0; x * d <= max; x++) {
      if (tmp.indexOf(x * d) === -1)
        // eslint-disable-next-line
        continue out;
      else tmp.splice(tmp.indexOf(x * d), 1);
    }
    if (tmp.length === 0) return '*/' + d;
  }
  // if not allowed, remove 0
  if (zeroAllowed === false) values.splice(values.indexOf(0), 1);
  // ranges ("2,8,20,25-35")
  let output = values[0] + '';
  let range = false;
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] + 1 === values[i]) {
      range = true;
    } else {
      if (range) output = output + '-' + values[i - 1];
      range = false;
      output = output + ',' + values[i];
    }
  }
  if (range) output = output + '-' + values[values.length - 1];
  return output;
};
const getCronExpression = (cronMinutes, cronHours, cronDayOfMonth, cronMonths, cronDayOfWeek) => {
  return cronMinutes + ' ' + cronHours + ' ' + cronDayOfMonth + ' ' + cronMonths + ' ' + cronDayOfWeek;
};
/** Update the variables {{{
 * @param source Source identifier
 * @param type hours/minutes/dom/months/dow
 * @return nothing
 */
export const generateCronExpression = (
  type = '1',
  minutes = [],
  hours = [],
  daysOfMonth = [],
  daysOfWeek = [],
  months = [],
  cronExpression
) => {
  const zeroAllowed = true;
  const _cronExpression = cronExpression.split(' ');
  let cronMinutes = _cronExpression[0] ? _cronExpression[0] : '*';
  let cronHours = _cronExpression[1] ? _cronExpression[1] : '*';
  let cronDayOfMonth = _cronExpression[2] ? _cronExpression[2] : '*';
  let cronMonths = _cronExpression[3] ? _cronExpression[3] : '*';
  let cronDayOfWeek = _cronExpression[4] ? _cronExpression[4] : '*';
  switch (type) {
    case '2':
      cronHours = cronCalculate(true, 23, hours);
      break;
    case '3':
      cronHours = cronCalculate(true, 23, hours);
      break;
    case '1':
      cronMinutes = cronCalculate(true, 59, minutes);
      break;
    case '5':
      cronDayOfMonth = cronCalculate(false, 31, daysOfMonth);
      break;
    case '6':
      cronMonths = cronCalculate(false, 12, months);
      break;
    case '4':
      cronDayOfWeek = cronCalculate(true, 6, daysOfWeek);
      break;
    default:
      cronHours = cronCalculate(true, 23, hours);
  }
  return getCronExpression(cronMinutes, cronHours, cronDayOfMonth, cronMonths, cronDayOfWeek);
};
