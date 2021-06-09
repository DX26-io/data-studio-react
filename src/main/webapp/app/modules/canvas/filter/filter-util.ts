import { COMPARABLE_DATA_TYPES, FILTER_TYPES } from 'app/shared/util/data-constraints.constants';
import { addNewExpression, ConditionExpression } from './condition-expression';
import { IBookmark } from 'app/shared/model/bookmark.model';
import { DYNAMIC_DATE_RANGE_CONFIG, tabList } from 'app/shared/util/data-constraints.constants';

// const paramObject = {};
// const selectedFilters = {};
const dynamicDateRangeMetaData = {};

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

export const isDateRange = (name, selectedFilters) => {
  if (selectedFilters[name]._meta.dataType) {
    if (selectedFilters[name]._meta.valueType === 'castValueType' || selectedFilters[name]._meta.valueType === 'valueType') {
      return false;
    }
    return isDateFilterType(selectedFilters[name]._meta.dataType);
  } else {
    return false;
  }
};

export const buildFilterCriteriasForDynamicDateRange = dimensionName => {
  if (dynamicDateRangeMetaData[dimensionName]) {
    const metaData = dynamicDateRangeMetaData[dimensionName];
    const isCustom = metaData.currentDynamicDateRangeConfig.isCustom ? 'true' : 'false';
    return isCustom + '||' + metaData.customDynamicDateRange + '||' + metaData.currentDynamicDateRangeConfig.title;
  } else {
    return null;
  }
};

export const getFilterCriterias = (selectedFilters, features) => {
  const filterCriterias = [];
  for (const key in selectedFilters) {
    if (Object.prototype.hasOwnProperty.call(selectedFilters, key)) {
      const param = selectedFilters[key];
      const isItemDateRange = isDateRange(key, selectedFilters);
      if (isItemDateRange && param._meta.valueType !== 'castValueType') {
        param[0] = changeDateFormat(param[0]);
        if (param[1]) {
          param[1] = changeDateFormat(param[1]);
        }
      }
      filterCriterias.push({
        value: selectedFilters[key].join('||'),
        metaData: isItemDateRange ? buildFilterCriteriasForDynamicDateRange(key) : null,
        dateRange: param._meta.valueType === 'dateRangeValueType' ? true : false,
        key,
        feature: features.filter(item => {
          return item.name.toLowerCase() === key;
        })[0],
      });
    }
  }
  return filterCriterias;
};

const buildDynamicDateRangeObject = (dimensionName, title, customDynamicDateRange) => {
  const metaData = {
    dimensionName,
    metadata: { currentDynamicDateRangeConfig: {}, customDynamicDateRange, dateRangeTab: 2 },
  };
  const configs = DYNAMIC_DATE_RANGE_CONFIG.filter(function (item) {
    return item.title === title;
  });
  metaData.metadata.currentDynamicDateRangeConfig = configs[0];
  return metaData;
};

const applyFeatureCriteria = (isTemporal, metadata, feature, value, filterName) => {
  if (isTemporal) {
    if (metadata) {
      const dynamics = metadata.split('||');
      const tooltipText = dynamics[0] === 'true' ? 'Last ' + dynamics[1] : dynamics[2];
      const dynamicDateRangeToolTip = { name: filterName, text: tooltipText };
      const dynamicDateRangeObject = buildDynamicDateRangeObject(feature.name, dynamics[2], dynamics[1]);
      // TODO
      // filterParametersService.saveDynamicDateRangeMetaData(filterName, dynamicDateRangeObject.metadata);
      // filterParametersService.saveDynamicDateRangeToolTip(dynamicDateRangeToolTip);
      // $rootScope.$broadcast("flairbiApp:bookmark-update-dynamic-date-range-meta-data", dynamicDateRangeObject);
    } else {
      const daterange = value.split('||');
      // set date range TODO
      // $rootScope.$broadcast("flairbiApp:filter-set-date-ranges", buildDateRange(feature.name, daterange));
    }
  }
  const valueType = isTemporal ? 'dateRangeValueType' : 'valueType';
  const filter = value.split('||');
  filter._meta = {
    dataType: feature.type,
    valueType,
  };
  return filter;
};

export const addFilterFromBookmark = (bookmark: IBookmark) => {
  const filters = {};
  bookmark.featureCriteria.forEach(function (criteria) {
    const isTemporal = criteria.dateRange && COMPARABLE_DATA_TYPES.includes(criteria.feature.type.toLowerCase());
    filters[criteria.feature.name] = applyFeatureCriteria(
      isTemporal,
      criteria.metaData,
      criteria.feature,
      criteria.value,
      criteria.feature.name
    );
  });
  return filters;
};

const buildDateRange = (dimensionName, daterange) => {
  return { dimensionName, startDate: daterange[0], endDate: daterange[1] };
};
