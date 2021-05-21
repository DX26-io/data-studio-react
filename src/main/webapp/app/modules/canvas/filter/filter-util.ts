import { COMPARABLE_DATA_TYPES, FILTER_TYPES } from 'app/shared/util/data-constraints.constants';
import { addNewExpression, ConditionExpression } from './condition-expression';

let paramObject = {};
let selectedFilters = {};
let dynamicDateRangeMetaData = {};

export const createBetweenExpressionBody = (value: any, secondValue: any, featureName: string, dataType: string, activeTab: string) => {
  const result = {
    '@type': 'Between',
    value,
    secondValue,
    activeTab,
    featureName,
    valueType: null,
    secondValueType: null,
  };
  if (dataType) {
    result.valueType = { value, type: dataType, '@type': 'valueType' };
    result.secondValueType = { value: secondValue, type: dataType, '@type': 'valueType' };
  }
  return result;
};
export const createCompareExpressionBody = (value: any, featureName: string, dataType: string) => {
  return {
    '@type': 'Compare',
    comparatorType: 'GTE',
    value,
    valueType: {
      '@type': 'valueType',
      value,
      type: dataType,
    },
    featureName,
  };
};
export const createContainsExpressionBody = (values: any, featureName: string, dataType: string = null) => {
  const ret = {
    '@type': 'Contains',
    values,
    featureName,
    valueTypes: null,
  };
  if (dataType) {
    ret.valueTypes = values.map(function (item) {
      return {
        '@type': 'valueType',
        value: item,
        type: dataType,
      };
    });
  }
  return ret;
};

export const createCompareFeaturePropertyExpressionBody = (value: any, featureName: string) => {
  const featureNameArr = featureName.split('.');
  const valueArr = value.split('.');
  return {
    '@type': 'Compare',
    comparatorType: 'EQ',
    valueType: {
      '@type': 'featureValueType',
      value: valueArr[1],
      table: valueArr[0],
    },
    featureProperty: {
      property: featureNameArr[1],
      table: featureNameArr[0],
    },
  };
};

export const createCompareExpressionBodyForInterval = (
  initialValue: any,
  endValue: any,
  featureName: string,
  interval: any,
  operator: string
) => {
  return {
    '@type': 'Between',
    featureName,
    valueType: {
      '@type': 'intervalValueType',
      operator,
      interval,
      value: initialValue,
    },
    secondValueType: {
      '@type': 'valueType',
      value: endValue,
    },
    secondValue: initialValue,
    activeTab: initialValue,
  };
};
export const isDateFilterType = (type: string) => {
  if (!type) {
    return false;
  }
  return COMPARABLE_DATA_TYPES.includes(type.toLowerCase());
};

export const changeDateFormat = (date: any) => {
  if (typeof date === 'string') {
    return date;
  } else {
    return (
      [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') +
      ' ' +
      [date.getHours(), date.getMinutes(), date.getSeconds()].join(':')
    );
  }
};

export const createBodyExpr = (values: any, name: string) => {
  const meta = values._meta || {};
  const valueType = meta.valueType || '';
  const type = meta ? meta.dataType : '';
  if (isDateFilterType(type) && type === 'dateRangeValueType') {
    if (values[1]) {
      values = [changeDateFormat(values[0]), changeDateFormat(values[1])];
    } else {
      values = [changeDateFormat(values[0])];
    }
  }
  if (valueType === 'compare') {
    return createCompareFeaturePropertyExpressionBody(values[0], values[1]);
  } else if (valueType === 'dateRangeValueType') {
    const dataType = meta.dataType || '';
    if (values.length === 2) {
      return createBetweenExpressionBody(values[0], values[1], name, dataType, values[2]);
    } else {
      return createCompareExpressionBody(values[0], name, dataType);
    }
  } else if (valueType === 'valueType' || valueType === 'castValueType') {
    const dataType = meta.dataType || '';
    return createContainsExpressionBody(values, name, dataType);
  } else if (valueType === 'intervalValueType') {
    const operator = meta.operator;
    const initialValue = meta.initialValue;
    const endValue = meta.endValue;
    const value = values[0];
    return createCompareExpressionBodyForInterval(initialValue, endValue, name, value, operator);
  }
  return createContainsExpressionBody(values, name);
};

export const getConditionExpressionForParams = (params: any, sourceParams: any) => {
  const finalParams = (params || []).concat(sourceParams || []);
  let body;
  let condition;
  for (const data of finalParams) {
    const name = Object.keys(data)[0];
    const values = data[name];
    if (values.length > 0) {
      if (!condition?.expression) {
        body = createBodyExpr(values, name);
        condition = ConditionExpression(body);
      } else {
        body = createBodyExpr(values, name);
        condition.expression = addNewExpression(condition, body);
      }
    }
  }

  return {
    conditionExpression: condition?.expression,
    sourceType: FILTER_TYPES.FILTER,
  };
};

export const getConditionExpression = (paramObject: any, additionalFeaturesArray: any = null) => {
  const params = paramObject || {};
  const paramsArray = Object.keys(params).map(key => {
    const o = {};
    o[key] = params[key];
    return o;
  });
  return getConditionExpressionForParams(additionalFeaturesArray, paramsArray);
};

export const saveDynamicDateRangeMetaData = (dimensionName: string, metaData: any) => {
  dynamicDateRangeMetaData[dimensionName] = metaData;
};
