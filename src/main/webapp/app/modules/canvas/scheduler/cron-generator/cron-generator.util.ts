// {{{ variables
// let cronMinutes = '*';
// let cronHours = '*';
// let cronDayOfMonth = '*';
// let cronMonths = '*';
// let cronDayOfWeek = '*';

// let cronMinutes_id = '#cron-minutes';
// let cronHours_id = '#cron-hours';
// let cronDayOfMonth_id = '#cron-dom';
// let cronMonths_id = '#cron-months';
// let cronDayOfWeek_id = '#cron-dow';
// let cron_output_id = '#cron-output';

/** {{{ Convert a list of values to cron-syntax
 * @param bool zeroAllowed  weather the number zero is allowed (true) or not
 *                          (false)
 * @param  int              max the maximum value (eg. 59 for minutes)
 * @param  int[]            values a list of selected values
 * @return string
 */
function cronCalculate(zeroAllowed, max, values) {
  if (zeroAllowed === false) values.push(0);
  if (values.length > max || values.length === 0) return '*';
  values.sort(function (a, b) {
    return a - b;
  });
  // divider ("*/n")
  for (let d = 2; d <= Math.ceil(max / 2); d++) {
    const tmp = values.slice();
    for (let x = 0; x * d <= max; x++) {
      if (tmp.indexOf(x * d) === -1) continue;
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
} // }}}
/** Convert a cron-expression (one item) to a list of values {{{
 * @param bool zeroAllowed  weather the number zero is allowed (true) or not
 *                          (false)
 * @param  int              max the maximum value (eg. 59 for minutes)
 * @param  string           the cron expression (eg. "*")
 * @return int[]
 */
function cronValueItemToList(allowZero, maxValue, value) {
  const list = [];
  if (value === '*') {
    for (let i = allowZero ? 0 : 1; i <= maxValue; i++) {
      list.push(i);
    }
  } else if (value.match(/^\*\/[1-9][0-9]? $/)) {
    const c = parseInt(value.match(/^\*\/([1-9][0-9]?) $/)[1],10);
    for (let i = allowZero ? 0 : 1; i <= maxValue; i++) {
      if (i % c === 0) list.push(i);
    }
  } else if (value.match(/^([0-9]+|[0-9]+-[0-9]+)(,[0-9]+|,[0-9]+-[0-9]+)* $/)) {
    const a = value.split(',');
    for (let i = 0; i < a.length; i++) {
      const e = a[i].split('-');
      if (e.length === 2) {
        for (let j = parseInt(e[0],10); j <= parseInt(e[1],10); j++) {
          list.push(j);
        }
      } else {
        list.push(parseInt(e[0],10));
      }
    }
  } else {
    return [];
  }
  return list;
} // }}}
/** Import the value of a given field to the variables {{{
 * @param source the input field containing the string
 */
// function importCronExpressionFromInput(source) {
//   // importCronExpression( $(source).val());
// } // }}}
// /** Import value of a given string to the variables {{{
//  * @param expression The string
//  */
// function importCronExpression(expression) {
//   if (!expression.match(/^((\*(\/[1-9][0-9]?)?|([0-9]{1,2}(-[0-9]{1,2})?)(,[0-9]{1,2}(-[0-9]{1,2})?)*)( | $)){5} $/)) return;
//   const parts = expression.split(' ');
//   // const tmp;
//   if (parts[0] !== cronMinutes) {
//     cronMinutes = parts[0];
//     cronHelperSelectList(cronMinutes_id, cronValueItemToList(true, 59, parts[0]));
//   }
//   if (parts[1] !== cronHours) {
//     cronHours = parts[1];
//     cronHelperSelectList(cronHours_id, cronValueItemToList(true, 23, parts[1]));
//   }
//   if (parts[2] !== cronDayOfMonth) {
//     cronDayOfMonth = parts[2];
//     cronHelperSelectList(cronDayOfMonth_id, cronValueItemToList(false, 31, parts[2]));
//   }
//   if (parts[3] !== cronMonths) {
//     cronMonths = parts[3];
//     cronHelperSelectList(cronMonths_id, cronValueItemToList(false, 12, parts[3]));
//   }
//   if (parts[4] !== cronDayOfWeek) {
//     cronDayOfWeek = parts[4];
//     cronHelperSelectList(cronDayOfWeek_id, cronValueItemToList(true, 6, parts[4]));
//   }
// }
/** Returns a string containing the current cron-expression {{{
 * @return string
 */
function getCronExpression(cronMinutes, cronHours, cronDayOfMonth, cronMonths, cronDayOfWeek) {
  return cronMinutes + ' ' + cronHours + ' ' + cronDayOfMonth + ' ' + cronMonths + ' ' + cronDayOfWeek;
} // }}}
/** Get a list of all selected items {{{
 * @param id The select-ID
 * @return int[]
 */
function getSelectedElements(id) {
  // return  $.map( $(id +' > option:selected'), function(element) {
  // 	if(parseInt(element.value) !== "NaN")
  // 		return parseInt(element.value);
  // });
} // }}}
/** Update the variables {{{
 * @param source Source identifier
 * @param type hours/minutes/dom/months/dow
 * @return nothing
 */
export const generateCronExpression = (type = '1', minutes = [], hours = [], daysOfMonth = [], daysOfWeek = [], months = [],cronExpression) => {
  const zeroAllowed = true;
  // let cronMinutes = '*';
  // let cronHours = '*';
  // let cronDayOfMonth = '*';
  // let cronMonths = '*';
  // let cronDayOfWeek = '*';
  switch (type) {
    case '2':
      //   cronHours = cronCalculate(true, 23, getSelectedElements(cronHours_id));
      cronExpression[1] = cronCalculate(true, 23, hours);
      break;
    case '3':
        cronExpression[1] = cronCalculate(true, 23, hours);
      // cronHours = cronCalculate(true, 23, getSelectedElements(cronHours_id));
      break;
    case '1':
        cronExpression[0] = cronCalculate(true, 59, minutes);
      // cronMinutes = cronCalculate(true, 59, getSelectedElements(cronMinutes_id));
      break;
    case '5':
        cronExpression[2] = cronCalculate(false, 31, daysOfMonth);
      // cronDayOfMonth = cronCalculate(false, 31, getSelectedElements(cronDayOfMonth_id));
      break;
    case '6':
        cronExpression[3] = cronCalculate(false, 12, months);
      // cronMonths = cronCalculate(false, 12, getSelectedElements(cronMonths_id));
      break;
    case '4':
        cronExpression[4] = cronCalculate(true, 6, daysOfWeek);
      // cronDayOfWeek = cronCalculate(true, 6, getSelectedElements(cronDayOfWeek_id));
      break;
    default:
        cronExpression[1] = cronCalculate(true, 23, hours);
  }
  // console.log("cron=="+getCronExpression(cronMinutes, cronHours, cronDayOfMonth, cronMonths, cronDayOfWeek));
  // return getCronExpression(cronMinutes, cronHours, cronDayOfMonth, cronMonths, cronDayOfWeek);
  // $(cron_output_id).val(getCronExpression);
  return cronExpression;
}; // }}}

String.prototype.replace = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}


/** Set the fields to a given template {{{
 * @param id the templates ID (see comments)
 */
// function cronTemplate(id) {
//   // select all:
//   cronHelperSelectAll(cronDayOfMonth_id);
//   cronHelperSelectAll(cronMonths_id);
//   cronHelperSelectAll(cronDayOfWeek_id);
//   switch (id) {
//     case 1: // every 5 minutes
//       cronHelperSelectList(cronMinutes_id, [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
//       cronHelperSelectAll(cronHours_id);
//       break;
//     case 2: // every 15 minutes
//       cronHelperSelectList(cronMinutes_id, [0, 15, 30, 45]);
//       cronHelperSelectAll(cronHours_id);
//       break;
//     case 3: // every 30 minutes
//       cronHelperSelectList(cronMinutes_id, [0, 30]);
//       cronHelperSelectAll(cronHours_id);
//       break;
//     case 4: // every hour
//       cronHelperSelectList(cronMinutes_id, [0]);
//       cronHelperSelectAll(cronHours_id);
//       break;
//     case 5: // every 3 hours
//       cronHelperSelectList(cronMinutes_id, [0]);
//       cronHelperSelectList(cronHours_id, [0, 3, 6, 9, 12, 15, 18, 21]);
//       break;
//     case 6: // every 4 hours
//       cronHelperSelectList(cronMinutes_id, [0]);
//       cronHelperSelectList(cronHours_id, [0, 4, 8, 12, 16, 20]);
//       break;
//     case 7: // every 6 hours
//       cronHelperSelectList(cronMinutes_id, [0]);
//       cronHelperSelectList(cronHours_id, [0, 6, 12, 18]);
//       break;
//     case 8: // every 12 hours
//       cronHelperSelectList(cronMinutes_id, [0]);
//       cronHelperSelectList(cronHours_id, [0, 12]);
//       break;
//     case 9: // every day at 00:30am
//       cronHelperSelectList(cronMinutes_id, [30]);
//       cronHelperSelectList(cronHours_id, [0]);
//       break;
//     case 10: //every sunday at 00:10am
//       cronHelperSelectList(cronMinutes_id, [10]);
//       cronHelperSelectList(cronHours_id, [0]);
//       cronHelperSelectList(cronDayOfWeek_id, [0]);
//       break;
//     default:
//       // select all
//       cronHelperSelectAll(cronMinutes_id);
//       cronHelperSelectAll(cronHours_id);
//   }
//   // $(cronMinutes_id).change();
//   // $(cronHours_id).change();
//   // $(cronDayOfMonth_id).change();
//   // $(cronMonths_id).change();
//   // $(cronDayOfWeek_id).change();
// } // }}}
/** List all select items contained in the list {{{
 * @param id jQuery selector
 * @param list The values to select
 */
function cronHelperSelectList(id, list) {
  // $(id).val(list);
} // }}}
/** Select all elements in a select element {{{
 * @param id jQuery selector
 */
function cronHelperSelectAll(id) {
  // $(id +' > option').prop('selected',true);
  // $(id).change();
} // }}}
