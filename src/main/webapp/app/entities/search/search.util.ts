import { ValidateFields } from 'app/modules/canvas/visualization/util/visualization-render-utils';
import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';
import { IFeature } from 'app/shared/model/feature.model';
import { Field } from 'app/shared/model/field.model';
import { IViews } from 'app/shared/model/views.model';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { IVisualizations } from 'app/shared/model/visualizations.model';
import { COMPARE_TYPES, DYNAMIC_DATE_RANGE_CONFIG } from 'app/shared/util/data-constraints.constants';
import { Constraint, REQUIRED_FIELDS } from 'app/shared/util/visualization.constants';
import { orderBy, trim } from 'lodash';
import { createProperties, createFields, createVisualMetadata } from '../visualizations/visualizations-util';
import { SearchResult } from './search.model';

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
      const featureName = element.substring(element.indexOf('(') + 1, element.indexOf(')'));
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
        properties: fieldType.propertyTypes.map(function (item) {
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
      properties: fieldType.propertyTypes.map(function (item) {
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
  for (let element of DYNAMIC_DATE_RANGE_CONFIG) {
    if (value.toLowerCase() === element.title.toLowerCase()) {
      conditionType = 'Between';
      break;
    }
  }
  return conditionType;
};
const isCompareTypes = item => {
  const compareType = {
    isCompare: false,
    expression: {
      feature: '',
      condition: '',
      statement: '',
    },
  };

  for (let element of COMPARE_TYPES) {
    if (item.includes(element.displayName)) {
      const searchCondition = {
        feature: item.substring(0, item.indexOf(element.displayName)),
        condition: element.displayName,
        statement: item.substring(item.indexOf(element.displayName) + element.displayName.length, item.length),
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
      func: item.substring(0, item.indexOf('(')),
      feature: item.substring(item.indexOf('(') + 1, item.indexOf(')')),
    };
    statements.push(aggregationStatement);
  });
  return statements;
};

const getCondition = condition => {
  const conditions = [];
  condition.forEach(item => {
    const compareType = isCompareTypes(item);
    if (compareType.isCompare) {
      const searchWhereStatement = {
        feature: compareType.expression.feature,
        condition: compareType.expression.condition,
        statement: compareType.expression.statement,
      };
      conditions.push(searchWhereStatement);
    } else if (item.includes('(') && item.includes(')')) {
      const searchWhereStatement = {
        feature: item.substring(0, item.indexOf('(')),
        condition: isDynamicDateRange(item.substring(item.indexOf('(') + 1, item.indexOf(')'))),
        statement: item.substring(item.indexOf('(') + 1, item.indexOf(')')),
      };
      conditions.push(searchWhereStatement);
    }
  });
  return condition;
};

const getOrderBy = (order: Array<string>) => {
  const orderBy = [];
  order.forEach(item => {
    debugger;
    const searchOrderByStatement = {
      feature: item.trim().split(' ')[0],
      direction: item.trim().split(' ')[1],
    };
    orderBy.push(searchOrderByStatement);
  });
  return orderBy;
};

const createSearchResult = (measuresList: Array<string>, dimensionsList: Array<string>, condition: Array<string>, order: Array<string>) => {
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

export const getQueryDTO = (searchText: string, features: readonly IFeature[], view: IViews, visualization: IVisualizations) => {
  const measuresList = searchText.substring(0, searchText.indexOf('by')).split(',');
  const dimensionsList = searchText.substring(searchText.indexOf('by'), searchText.indexOf('filter by')).replace('by', '').split(',');
  const condition = searchText
    .substring(searchText.indexOf('filter by'), searchText.indexOf('order by'))
    .replace('filter by', '')
    .split(',');
  const order = searchText.substring(searchText.indexOf('order by'), searchText.indexOf('limit')).replace('order by', '').split(',');
  const limit = searchText.substring(searchText.indexOf('limit'), searchText.length).replace('limit', '').split(',');
  const visual = createVisualFields(features, dimensionsList, measuresList, view, visualization);

  const searchObject = createSearchResult(measuresList, dimensionsList, condition, order);
  if (visual.fields && ValidateFields(visual.fields)) {
    const visualMetadata = VisualWrap(visual);
    const queryDTO = visualMetadata.getQueryParametersForSearch(visual, null, null, 0);
    return queryDTO;
  }
};
