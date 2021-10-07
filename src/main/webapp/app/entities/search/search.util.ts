import {
  adjustStartDateRangeInterval,
  endOfDay,
  formatDate,
  getStartDateRange,
  getStartDateRangeInterval,
  getStartDateRangeTimeUnit,
  resetTimezone,
  resetTimezoneData,
  startOfDay,
  strToDate,
} from 'app/modules/canvas/data-constraints/utils/date-util';
import { ValidateFields } from 'app/modules/canvas/visualization/util/visualization-render-utils';
import { getDimension } from 'app/modules/canvas/visualization/util/visualization-utils';
import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';
import { IFeature } from 'app/shared/model/feature.model';
import { IViews } from 'app/shared/model/views.model';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { IVisualizations } from 'app/shared/model/visualizations.model';
import { COMPARE_TYPES, DYNAMIC_DATE_RANGE_CONFIG } from 'app/shared/util/data-constraints.constants';
import { BETWEEN } from 'app/shared/util/visualization.constants';
import { trim } from 'lodash';
import { createVisualMetadata } from '../visualizations/visualizations-util';
import { CompareType, SearchResult } from './search.model';
import { addOptionIntoFilters } from 'app/modules/canvas/filter/filter-util';
import { COMPARABLE_DATA_TYPES, FILTER_TYPES, CONDITION_TYPES } from 'app/shared/util/data-constraints.constants';
import { addNewExpression, ConditionExpression } from 'app/modules/canvas/filter/condition-expression';
import { IBookmark } from 'app/shared/model/bookmark.model';
import { IQueryDTO } from 'app/shared/model/query-dto.model';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { dateToString } from 'app/modules/canvas/data-constraints/utils/date-util';
import uuid from 'react-uuid';

// TODO : there are many duplicate functions, need to remove
// let the below code commented as they will be used in future


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

export const createCompareFeaturePropertyExpressionBody = (comparatorType, values: any, featureName: string) => {
  const dataType = values._meta.dataType || '';
  return {
    '@type': 'Compare',
    value: values[0],
    comparatorType,
    featureName,
    valueType: {
      '@type': 'featureValueType',
      value: values[0],
      type: dataType,
    },
    // featureProperty: null,
    uuid: uuid(),
    identifier:uuid()
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
  if (date) {
    if (typeof date === 'string') {
      return date;
    } else {
      return (
        [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') +
        ' ' +
        [date.getHours(), date.getMinutes(), date.getSeconds()].join(':')
      );
    }
  }
};

const addDateRangeFilter = (filterParameters, date, feature) => {
  const name = feature?.name;
  const type = feature?.type;
  if (!filterParameters[name]) {
    filterParameters[name] = [];
  }
  filterParameters[name].push(date);
  filterParameters[name]._meta = {
    dataType: type,
    valueType: 'dateRangeValueType',
  };
  return filterParameters;
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

const parseViewFeatureMetadata = (metadata, feature, value, filterName) => {
  let dynamics;
  let tooltipText;
  let dynamicDateRangeToolTip;
  let dynamicDateRangeObject;
  const daterange = value.split('||');
  let selected;
  if (metadata) {
    dynamics = metadata.split('||');
    tooltipText = dynamics[0] === 'true' ? 'Last ' + dynamics[1] : dynamics[2];
    dynamicDateRangeToolTip = { name: filterName, text: tooltipText };
    dynamicDateRangeObject = buildDynamicDateRangeObject(feature?.name, dynamics[2], dynamics[1]);
    selected = {};
  } else {
    dynamicDateRangeObject = {
      dimensionName: feature.name,
      metadata: {
        dateRangeTab: daterange.length === 1 ? 0 : 1,
        customDynamicDateRange: 1,
        currentDynamicDateRangeConfig: {},
      },
    };
    selected = daterange;
  }

  return {
    values: daterange,
    metadataValues: dynamics,
    tooltip: tooltipText,
    tooltipObj: dynamicDateRangeToolTip,
    metadata: dynamicDateRangeObject,
    selected,
  };
};

const applyViewFeatureCriteria = (viewFeatureCriterias, selectedFilter, featureEntities, saveFilter, saveDynamicDateRangeMetaData) => {
  if (viewFeatureCriterias && viewFeatureCriterias.length > 0) {
    let filters = selectedFilter;
    viewFeatureCriterias.forEach(criteria => {
      const feature = featureEntities && featureEntities.filter(item => item.name === criteria.feature.name)[0];
      const data = parseViewFeatureMetadata(criteria.metadata, feature, criteria.value, feature?.name);
      if (feature && feature.selected && feature.selected2 && feature.metadata) {
        feature.selected = data.selected[0];
        feature.selected2 = data.selected[1];
        feature.metadata = data.metadata.metadata;
      }
      // if (data["dateRangeTab"] === 2) {
      saveDynamicDateRangeMetaData(feature.name, data.metadata.metadata);
      // filterParametersService.saveDynamicDateRangeToolTip(data.tooltipObj);
      // }
      delete filters[feature?.name];
      filters = addDateRangeFilter(filters, data.values[0], feature);
      filters = addDateRangeFilter(filters, data.values[1], feature);
    });
    saveFilter(filters);
    // filterParametersService.save(filterParametersService.getSelectedFilter());
  }
  return viewFeatureCriterias && viewFeatureCriterias.map(criteria => criteria.feature.name);
};

export const applyDateFilters = (viewFeatureCriterias, selectedFilter, featureEntities, saveFilter, saveDynamicDateRangeMetaData) => {
  const applied = applyViewFeatureCriteria(viewFeatureCriterias, selectedFilter, featureEntities, saveFilter, saveDynamicDateRangeMetaData);
  // applyDefaultFilters(applied, selectedFilter, featureEntities);
};

const applyDefaultFilters = (excluded, selectedFilter, featureEntities) => {
  const mandatoryDimensions = featureEntities
    .filter(function (item) {
      return excluded.includes(item.name);
    })
    .filter(function (item) {
      return item.featureType === 'DIMENSION' && item.dateFilter === 'ENABLED';
    })
    .filter(function (item) {
      return selectedFilter[item.name];
    });

  if (mandatoryDimensions.length > 0) {
    mandatoryDimensions.forEach(function (item) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      item.selected = dateToString(startDate);
      item.selected2 = dateToString(new Date());
      item.metadata = {
        dateRangeTab: 1,
        customDynamicDateRange: 1,
        currentDynamicDateRangeConfig: {},
      };
    });
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
    return createCompareFeaturePropertyExpressionBody(meta.comparatorType,values, name);
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

export const getFilterCriterias = (selectedFilters, features, _dynamicDateRangeMetaData) => {
  const filterCriterias = [];
  dynamicDateRangeMetaData = _dynamicDateRangeMetaData;
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

export const getViewFeatureCriteria = (selectedFilters: any, features: any, viewId: number, _dynamicDateRangeMetaData: any) => {
  const _features = getFilterCriterias(selectedFilters, features, _dynamicDateRangeMetaData)
    .filter(item => item.dateRange)
    .map(item => ({
      value: item.value,
      featureId: item.feature.id,
      metadata: item.metaData,
    }));
  return {
    features: _features,
    viewId,
  };
};

const buildDateRange = (dimensionName, daterange) => {
  return { dimensionName, startDate: daterange[0], endDate: daterange[1] };
};

export const getPin = pin => {
  return pin === null || pin === false ? false : true;
};

export const load = (q, dimension, viewId, datasourceId) => {
  const query: IQueryDTO = {
    fields: [{ name: dimension }],
    distinct: true,
    limit: 100,
  };
  if (q) {
    query.conditionExpressions = [
      {
        sourceType: 'FILTER',
        conditionExpression: {
          '@type': 'Like',
          featureName: dimension,
          caseInsensitive: true,
          value: q,
        },
      },
    ];
  }
  forwardCall(
    datasourceId,
    {
      queryDTO: query,
      viewId,
      type: 'filters',
    },
    viewId
  );
};

export const generateFilterOptions = data => {
  const options = [];
  if (data) {
    const _data = data?.body;
    _data.forEach(function (option) {
      const featureName = Object.keys(option)[0];
      options.push({ value: option[featureName], label: option[featureName] });
    });
  }
  return options;
};

export const generateOptionsForDateRange = (config: any) => {
  const options = [];
  if (config && (config.tab === '2' || config.dateRangeTab === 2)) {
    options.push({ value: config.currentDynamicDateRangeConfig.title, label: config.currentDynamicDateRangeConfig.title });
  } else {
    const date = changeDateFormat(config?.startDateFormatted) + ' To ' + changeDateFormat(config?.endDateFormatted);
    options.push({ value: date, label: date });
  }
  return options;
};

export const removeEnabledFilters = (filters: any, features: readonly IFeature[]) => {
  const updatedFilter = filters;
  Object.keys(filters).map((featureName, i) => {
    if (!features.find(x => x.name === featureName && x.dateFilter === 'ENABLED')) {
      delete updatedFilter[featureName];
    }
  });
  return updatedFilter;
};

// export const addOptionIntoFilters = (filter, filters, feature) => {
//   if (filters[feature.name] && filters[feature.name].length > 0) {
//     filters[feature.name].push(filter);
//   } else {
//     filters[feature.name] = [];
//     filters[feature.name].push(filter);
//   }
//   filters[feature.name]._meta = {
//     dataType: feature.type,
//     valueType: 'valueType',
//   };
//   return Object.assign({}, filters);
// };

export const removeOptionFromFilters = (filter, filters, feature) => {
  if (filters[feature.name] && filters[feature.name].length === 0) {
    delete filters[feature.name];
    return filters;
  } else {
    const index = filters[feature.name].findIndex(item => item === filter);
    if (index > -1) {
      filters[feature.name].splice(index, 1);
      if (filters[feature.name].length === 0) delete filters[feature.name];
    }
  }
  return Object.assign({}, filters);
};

// const createDimensions = (features: readonly IFeature[], dimensionsList: Array<string>) => {
//   const dimensions = [];
//   dimensionsList.forEach(element => {
//     const dimension = features.find(item => {
//       return item.name === trim(element);
//     });
//     if (dimension) {
//       dimensions.push(dimension);
//     }
//   });
//   return dimensions;
// };

// const createMeasures = (features: readonly IFeature[], measuresList: Array<string>) => {
//   const measures = [];
//   measuresList.forEach(element => {
//     const measure = features.find(item => {
//       const featureName = element.substring(element.search(/[(]/g) + 1, element.search(/[)]/g));
//       return item.name === trim(featureName);
//     });
//     if (measure) {
//       measures.push(measure);
//     }
//   });
//   return measures;
// };

// const setDimensions = (dimensions: readonly IFeature[], visual: IVisualMetadataSet, visualWrap: any) => {
//   dimensions.forEach((element, index) => {
//     if (index === 0) {
//       visual.fields[index].feature = dimensions[index];
//     } else {
//       const fieldType = visualWrap.nextFieldDimension(visual.fields, visual.metadataVisual);
//       const field = {
//         fieldType,
//         feature: dimensions[index],
//         constraint: fieldType.constraint,
//         properties: fieldType.propertyTypes.map(item => {
//           return {
//             propertyType: item.propertyType,
//             value: item.propertyType.defaultValue,
//             type: item.propertyType.type,
//             order: item.order,
//           };
//         }),
//         order: fieldType.order,
//       };
//       visual.fields.push(field);
//     }
//   });
//   return visual;
// };

// const setMeasures = (measures: readonly IFeature[], visual: IVisualMetadataSet, visualWrap: any) => {
//   measures.forEach((element, index) => {
//     const fieldType = visualWrap.nextFieldMeasure(visual.fields, visual.metadataVisual);
//     const field = {
//       fieldType,
//       feature: measures[index],
//       constraint: fieldType.constraint,
//       properties: fieldType.propertyTypes.map(item => {
//         return {
//           propertyType: item.propertyType,
//           value: item.propertyType.defaultValue,
//           type: item.propertyType.type,
//           order: item.order,
//         };
//       }),
//       order: fieldType.order,
//     };
//     visual.fields.push(field);
//   });
//   return visual;
// };

// export const createVisualFields = (
//   features: readonly IFeature[],
//   dimensionsList: Array<string>,
//   measuresList: Array<string>,
//   view: IViews,
//   visualization: IVisualizations
// ) => {
//   let visual = createVisualMetadata(visualization, view, 0);
//   const dimensions = createDimensions(features, dimensionsList);
//   const measures = createMeasures(features, measuresList);
//   const visualWrap = VisualWrap(visual);
//   visual = setDimensions(dimensions, visual, visualWrap);
//   visual = setMeasures(measures, visual, visualWrap);
//   return visual;
// };

// const isDynamicDateRange = value => {
//   let conditionType = 'In';
//   for (const element of DYNAMIC_DATE_RANGE_CONFIG) {
//     if (value.toLowerCase() === element.title.toLowerCase()) {
//       conditionType = BETWEEN;
//       break;
//     }
//   }
//   return conditionType;
// };

// const isCompareTypes = item => {
//   const compareType: CompareType = {
//     isCompare: false,
//     expression: {
//       feature: '',
//       condition: '',
//       statement: '',
//       featureDataType: '',
//       statements: [],
//     },
//   };

//   for (const element of COMPARE_TYPES) {
//     if (item.includes(element.displayName)) {
//       const searchCondition = {
//         feature: trim(item.substring(0, item.search(element.displayName))),
//         condition: element.displayName,
//         statement: trim(item.substring(item.search(element.displayName) + element.displayName.length, item.length)),
//         featureDataType: '',
//         statements: [],
//       };
//       compareType.isCompare = true;
//       compareType.expression = searchCondition;
//       break;
//     }
//   }

//   return compareType;
// };

// const getAggregation = (measuresList: Array<string>) => {
//   const statements = [];
//   measuresList.forEach(item => {
//     const aggregationStatement = {
//       func: item.substring(0, item.search(/[(]/g)),
//       feature: item.substring(item.search(/[(]/g) + 1, item.search(/[)]/g)),
//     };
//     statements.push(aggregationStatement);
//   });
//   return statements;
// };

// const getCondition = condition => {
//   const conditions = [];
//   condition.forEach((item, index) => {
//     const compareType = isCompareTypes(item);
//     if (compareType.isCompare) {
//       const searchWhereStatement = {
//         feature: trim(compareType.expression.feature),
//         condition: compareType.expression.condition,
//         statement: compareType.expression.statement,
//         featureDataType: compareType.expression.featureDataType,
//       };
//       conditions.push(searchWhereStatement);
//     } else if (item.includes('(') && item.includes(')')) {
//       const condtionType = isDynamicDateRange(item.substring(item.search(/[(]/g) + 1, item.search(/[)]/g)));
//       const searchWhereStatement = {
//         feature: trim(item.substring(0, item.search(/[(]/g))),
//         condition: condtionType,
//         statement: item.substring(item.search(/[(]/g) + 1, item.search(/[)]/g)),
//         featureDataType: compareType.expression.featureDataType,
//         statements: [],
//       };
//       if (condtionType === BETWEEN) {
//         let fromDate;
//         let toDate;
//         let startDateFormatted = '';
//         let endDateFormatted = '';

//         const currentDynamicDateRangeConfig = DYNAMIC_DATE_RANGE_CONFIG.find(
//           d => d.title.toLocaleLowerCase() === searchWhereStatement.statement
//         );
//         const startDateRange = getStartDateRange(currentDynamicDateRangeConfig);
//         if (startDateRange) {
//           fromDate = formatDate(resetTimezone(strToDate(startDateRange)));
//           startDateFormatted = fromDate;
//         } else {
//           const startDateRangeInterval = getStartDateRangeInterval(currentDynamicDateRangeConfig, '0');
//           if (!startDateRangeInterval) {
//             return;
//           }
//           const timeUnit = getStartDateRangeTimeUnit(currentDynamicDateRangeConfig) || '';
//           fromDate = '__FLAIR_INTERVAL_OPERATION(NOW(' + timeUnit + "), '-', '" + startDateRangeInterval + "')";
//           const adjustedDate = adjustStartDateRangeInterval(currentDynamicDateRangeConfig);
//           startDateFormatted = formatDate(resetTimezone(startOfDay(adjustedDate)));
//         }
//         endDateFormatted = formatDate(resetTimezone(endOfDay(strToDate(new Date()))));
//         toDate = '__FLAIR_NOW()';

//         if (fromDate) {
//           fromDate = resetTimezoneData(fromDate);
//         }
//         if (toDate) {
//           toDate = resetTimezoneData(toDate);
//         }
//         searchWhereStatement.statements.push(fromDate, toDate);
//       }
//       conditions.push(searchWhereStatement);
//     }
//   });
//   return conditions;
// };

// const getOrderBy = (order: Array<string>) => {
//   const orderBy = [];
//   order.forEach(item => {
//     const searchOrderByStatement = {
//       feature: item.trim().split(' ')[0],
//       direction: item.trim().split(' ')[1],
//     };
//     orderBy.push(searchOrderByStatement);
//   });
//   return orderBy;
// };

// const createSearchResult = (
//   measuresList: Array<string>,
//   dimensionsList: Array<string>,
//   condition: Array<string>,
//   order: Array<string>,
//   features: readonly IFeature[]
// ) => {
//   const modal: SearchResult = {
//     aggregation: {
//       statements: getAggregation(measuresList),
//     },
//     by: {
//       features: dimensionsList,
//     },
//     where: {
//       conditions: getCondition(condition),
//     },
//     orderBy: getOrderBy(order),
//   };
//   return modal;
// };

// const findCompareObject = oprater => {
//   return COMPARE_TYPES.find(item => {
//     return item.displayName === oprater;
//   });
// };

// const createFilterObject = (searchObject: SearchResult, features: readonly IFeature[]) => {
//   const filter = {};
//   searchObject.where.conditions.forEach(item => {
//     if (item.condition === BETWEEN) {
//       filter[item.feature] = item.statements;
//       filter[item.feature]._meta = {
//         dataType: getDimension(features, item.feature).type,
//         valueType: 'dateRangeValueType',
//       };
//     } else if (findCompareObject(item.condition)) {
//       filter[item.feature] = item.statement.split(' ').map(val => {
//         return (val = val.replace(/'/gi, ''));
//       });
//       filter[item.feature]._meta = {
//         dataType: getDimension(features, item.feature).type,
//         valueType: 'compare',
//       };
//     } else {
//       filter[item.feature] = item.statement.split(' ').map(val => {
//         return (val = val.replace(/'/gi, ''));
//       });
//       filter[item.feature]._meta = {
//         dataType: getDimension(features, item.feature).type,
//         valueType: 'valueType',
//       };
//     }
//   });
//   return filter;
// };

// commented for now
// export const getQueryDTO = (searchText: string, features: readonly IFeature[], view: IViews, visualization: IVisualizations) => {
//   const measuresList = searchText.substring(0, searchText.search('by')).split(',');
//   const dimensionsList = searchText.substring(searchText.search('by'), searchText.search('filter by')).replace('by', '').split(',');
//   const condition = searchText.substring(searchText.search('filter by'), searchText.search('order by')).replace('filter by', '').split(',');
//   const order = searchText.substring(searchText.search('order by'), searchText.length).replace('order by', '').split(',');
//   // const limit = searchText.substring(searchText.search('limit'), searchText.length).replace('limit', '').split(',');
//   const visual = createVisualFields(features, dimensionsList, measuresList, view, visualization);

//   const searchObject = createSearchResult(measuresList, dimensionsList, condition, order, features);
//   if (visual.fields && ValidateFields(visual.fields)) {
//     const filter = createFilterObject(searchObject, features);
//     const visualMetadata = VisualWrap(visual);
//     const queryDTO = visualMetadata.getQueryParametersForSearch(visual, filter, getConditionExpression(filter), 0, searchObject);
//     return queryDTO;
//   }
// };

export const buildQueryDTO = queryText => {
  const fields = queryText
    .split('by')[1]
    .split('filter')
    .filter(f => !!f.trim());
};

export const findFeature = (featureName, features) => {
  const _feature = features.filter(f => f.name === featureName);
  return _feature[0];
};

export const buildFilters = (filter, filters, feature, condition) => {
  if (filters[feature.name] && filters[feature.name].length > 0) {
    filters[feature.name].push(filter);
  } else {
    filters[feature.name] = [];
    filters[feature.name].push(filter);
  }
  const compareType = COMPARE_TYPES.filter(type => type.displayName === condition);
  filters[feature.name]._meta = {
    dataType: feature.type,
    valueType: compareType && compareType[0] ? 'compare' : 'valueType',
    comparatorType: compareType && compareType[0] ? compareType[0].value : null
  };
  return Object.assign({}, filters);
};

export const convertSearchStructToQueryDTO = searchStruct => {
  const groupBy = searchStruct.by.features.map(function (feature) {
    return { name: feature };
  });
  const aggregations = searchStruct.aggregation.statements.map(function (st) {
    return { aggregation: st.func, name: st.feature, alias: st.feature };
  });
  const fields = groupBy.concat(aggregations);
  let orders = null;
  if (searchStruct.orderBy) {
    orders = [
      {
        direction: searchStruct.orderBy.direction,
        feature: {
          name: searchStruct.orderBy.feature,
        },
      },
    ];
  } else {
    orders = [
      {
        direction: 'DESC',
        feature: {
          name: groupBy[0].name,
        },
      },
    ];
  }
  return { fields, groupBy, orders };
};

export const convertSearchStructToFilters = (features, conditions) => {
  let filters = {};
  conditions.map(function (con) {
    const feature = findFeature(con.feature, features);
    if (con.statements && con.statements.length > 0) {
      con.statements.map(function (st) {
        if (feature.type === 'varchar' || feature.type === 'string' || typeof feature.type) {
          st = st.replace(/["']/g, '');
        }
        filters = buildFilters(st, filters, feature, con.condition);
      });
    } else {
      filters = buildFilters(con.statement, filters, feature, con.condition);
    }
  });
  return filters;
};
