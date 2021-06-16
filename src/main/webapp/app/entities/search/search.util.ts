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
import { getConditionExpression } from 'app/modules/canvas/filter/filter-util';
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

const createDimensions = (features: readonly IFeature[], dimensionsList: Array<string>) => {
  const dimensions = [];
  dimensionsList.forEach(element => {
    const dimension = features.find(item => {
      return item.name === trim(element);
    });
    if (dimension) {
      dimensions.push(dimension);
    }
  });
  return dimensions;
};

const createMeasures = (features: readonly IFeature[], measuresList: Array<string>) => {
  const measures = [];
  measuresList.forEach(element => {
    const measure = features.find(item => {
      const featureName = element.substring(element.search(/[(]/g) + 1, element.search(/[)]/g));
      return item.name === trim(featureName);
    });
    if (measure) {
      measures.push(measure);
    }
  });
  return measures;
};

const setDimensions = (dimensions: readonly IFeature[], visual: IVisualMetadataSet, visualWrap: any) => {
  dimensions.forEach((element, index) => {
    if (index === 0) {
      visual.fields[index].feature = dimensions[index];
    } else {
      const fieldType = visualWrap.nextFieldDimension(visual.fields, visual.metadataVisual);
      const field = {
        fieldType,
        feature: dimensions[index],
        constraint: fieldType.constraint,
        properties: fieldType.propertyTypes.map(item => {
          return {
            propertyType: item.propertyType,
            value: item.propertyType.defaultValue,
            type: item.propertyType.type,
            order: item.order,
          };
        }),
        order: fieldType.order,
      };
      visual.fields.push(field);
    }
  });
  return visual;
};

const setMeasures = (measures: readonly IFeature[], visual: IVisualMetadataSet, visualWrap: any) => {
  measures.forEach((element, index) => {
    const fieldType = visualWrap.nextFieldMeasure(visual.fields, visual.metadataVisual);
    const field = {
      fieldType,
      feature: measures[index],
      constraint: fieldType.constraint,
      properties: fieldType.propertyTypes.map(item => {
        return {
          propertyType: item.propertyType,
          value: item.propertyType.defaultValue,
          type: item.propertyType.type,
          order: item.order,
        };
      }),
      order: fieldType.order,
    };
    visual.fields.push(field);
  });
  return visual;
};

export const createVisualFields = (
  features: readonly IFeature[],
  dimensionsList: Array<string>,
  measuresList: Array<string>,
  view: IViews,
  visualization: IVisualizations
) => {
  let visual = createVisualMetadata(visualization, view, 0);
  const dimensions = createDimensions(features, dimensionsList);
  const measures = createMeasures(features, measuresList);
  const visualWrap = VisualWrap(visual);
  visual = setDimensions(dimensions, visual, visualWrap);
  visual = setMeasures(measures, visual, visualWrap);
  return visual;
};

const isDynamicDateRange = value => {
  let conditionType = 'In';
  for (const element of DYNAMIC_DATE_RANGE_CONFIG) {
    if (value.toLowerCase() === element.title.toLowerCase()) {
      conditionType = BETWEEN;
      break;
    }
  }
  return conditionType;
};

const isCompareTypes = item => {
  const compareType: CompareType = {
    isCompare: false,
    expression: {
      feature: '',
      condition: '',
      statement: '',
      featureDataType: '',
      statements: [],
    },
  };

  for (const element of COMPARE_TYPES) {
    if (item.includes(element.displayName)) {
      const searchCondition = {
        feature: trim(item.substring(0, item.search(element.displayName))),
        condition: element.displayName,
        statement: trim(item.substring(item.search(element.displayName) + element.displayName.length, item.length)),
        featureDataType: '',
        statements: [],
      };
      compareType.isCompare = true;
      compareType.expression = searchCondition;
      break;
    }
  }

  return compareType;
};

const getAggregation = (measuresList: Array<string>) => {
  const statements = [];
  measuresList.forEach(item => {
    const aggregationStatement = {
      func: item.substring(0, item.search(/[(]/g)),
      feature: item.substring(item.search(/[(]/g) + 1, item.search(/[)]/g)),
    };
    statements.push(aggregationStatement);
  });
  return statements;
};

const getCondition = condition => {
  const conditions = [];
  condition.forEach((item, index) => {
    const compareType = isCompareTypes(item);
    if (compareType.isCompare) {
      const searchWhereStatement = {
        feature: trim(compareType.expression.feature),
        condition: compareType.expression.condition,
        statement: compareType.expression.statement,
        featureDataType: compareType.expression.featureDataType,
      };
      conditions.push(searchWhereStatement);
    } else if (item.includes('(') && item.includes(')')) {
      const condtionType = isDynamicDateRange(item.substring(item.search(/[(]/g) + 1, item.search(/[)]/g)));
      const searchWhereStatement = {
        feature: trim(item.substring(0, item.search(/[(]/g))),
        condition: condtionType,
        statement: item.substring(item.search(/[(]/g) + 1, item.search(/[)]/g)),
        featureDataType: compareType.expression.featureDataType,
        statements: [],
      };
      if (condtionType === BETWEEN) {
        let fromDate;
        let toDate;
        let startDateFormatted = '';
        let endDateFormatted = '';

        const currentDynamicDateRangeConfig = DYNAMIC_DATE_RANGE_CONFIG.find(
          d => d.title.toLocaleLowerCase() === searchWhereStatement.statement
        );
        const startDateRange = getStartDateRange(currentDynamicDateRangeConfig);
        if (startDateRange) {
          fromDate = formatDate(resetTimezone(strToDate(startDateRange)));
          startDateFormatted = fromDate;
        } else {
          const startDateRangeInterval = getStartDateRangeInterval(currentDynamicDateRangeConfig, '0');
          if (!startDateRangeInterval) {
            return;
          }
          const timeUnit = getStartDateRangeTimeUnit(currentDynamicDateRangeConfig) || '';
          fromDate = '__FLAIR_INTERVAL_OPERATION(NOW(' + timeUnit + "), '-', '" + startDateRangeInterval + "')";
          const adjustedDate = adjustStartDateRangeInterval(currentDynamicDateRangeConfig);
          startDateFormatted = formatDate(resetTimezone(startOfDay(adjustedDate)));
        }
        endDateFormatted = formatDate(resetTimezone(endOfDay(strToDate(new Date()))));
        toDate = '__FLAIR_NOW()';

        if (fromDate) {
          fromDate = resetTimezoneData(fromDate);
        }
        if (toDate) {
          toDate = resetTimezoneData(toDate);
        }
        searchWhereStatement.statements.push(fromDate, toDate);
      }
      conditions.push(searchWhereStatement);
    }
  });
  return conditions;
};

const getOrderBy = (order: Array<string>) => {
  const orderBy = [];
  order.forEach(item => {
    const searchOrderByStatement = {
      feature: item.trim().split(' ')[0],
      direction: item.trim().split(' ')[1],
    };
    orderBy.push(searchOrderByStatement);
  });
  return orderBy;
};

const createSearchResult = (
  measuresList: Array<string>,
  dimensionsList: Array<string>,
  condition: Array<string>,
  order: Array<string>,
  features: readonly IFeature[]
) => {
  const modal: SearchResult = {
    aggregation: {
      statements: getAggregation(measuresList),
    },
    by: {
      features: dimensionsList,
    },
    where: {
      conditions: getCondition(condition),
    },
    orderBy: getOrderBy(order),
  };
  return modal;
};

const findCompareObject = oprater => {
  return COMPARE_TYPES.find(item => {
    return item.displayName === oprater;
  });
};

const createFilterObject = (searchObject: SearchResult, features: readonly IFeature[]) => {
  const filter = {};
  searchObject.where.conditions.forEach(item => {
    if (item.condition === BETWEEN) {
      filter[item.feature] = item.statements;
      filter[item.feature]._meta = {
        dataType: getDimension(features, item.feature).type,
        valueType: 'dateRangeValueType',
      };
    } else if (findCompareObject(item.condition)) {
      filter[item.feature] = item.statement.split(' ').map(val => {
        return (val = val.replace(/'/gi, ''));
      });
      filter[item.feature]._meta = {
        dataType: getDimension(features, item.feature).type,
        valueType: 'compare',
      };
    } else {
      filter[item.feature] = item.statement.split(' ').map(val => {
        return (val = val.replace(/'/gi, ''));
      });
      filter[item.feature]._meta = {
        dataType: getDimension(features, item.feature).type,
        valueType: 'valueType',
      };
    }
  });
  return filter;
};

export const getQueryDTO = (searchText: string, features: readonly IFeature[], view: IViews, visualization: IVisualizations) => {
  const measuresList = searchText.substring(0, searchText.search('by')).split(',');
  const dimensionsList = searchText.substring(searchText.search('by'), searchText.search('filter by')).replace('by', '').split(',');
  const condition = searchText.substring(searchText.search('filter by'), searchText.search('order by')).replace('filter by', '').split(',');
  const order = searchText.substring(searchText.search('order by'), searchText.length).replace('order by', '').split(',');
  // const limit = searchText.substring(searchText.search('limit'), searchText.length).replace('limit', '').split(',');
  const visual = createVisualFields(features, dimensionsList, measuresList, view, visualization);

  const searchObject = createSearchResult(measuresList, dimensionsList, condition, order, features);
  if (visual.fields && ValidateFields(visual.fields)) {
    const filter = createFilterObject(searchObject, features);
    const visualMetadata = VisualWrap(visual);
    const queryDTO = visualMetadata.getQueryParametersForSearch(visual, filter, getConditionExpression(filter), 0, searchObject);
    return queryDTO;
  }
};
