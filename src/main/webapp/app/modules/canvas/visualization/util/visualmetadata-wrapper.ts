const nextFeature = (fields, fieldTypes) => {
  let i = 0;
  let run = true;

  while (run) {
    const field = fields[i];
    const fieldType = fieldTypes[i];

    if (field && fieldType && field.fieldType.id === fieldType.id) {
      i++;
    } else {
      run = false;
    }
  }

  return fieldTypes[i];
};

const nextFieldDimension = (fields, metadataVisual) => {
  const dimensionFields = fields.filter(function (item) {
    return item.fieldType.featureType === 'DIMENSION';
  });

  const dimensionFieldTypes = metadataVisual.fieldTypes.filter(function (item) {
    return item.featureType === 'DIMENSION';
  });

  return nextFeature(dimensionFields, dimensionFieldTypes);
};

const isFunction = obj => {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

const resolveOrElse = orElse => {
  if (isFunction(orElse)) {
    return orElse();
  } else {
    return orElse;
  }
};

const getProperty = (properties, propertyName, orElse = null) => {
  const props = properties.filter(function (item) {
    // return item.propertyType.name === propertyName;
    return item.propertyType.name.indexOf(propertyName) !== -1;
  });

  const property = props[0];

  if (!property) {
    return resolveOrElse(orElse);
  } else {
    if (property.value && property.value.value) {
      return property.value.value;
    } else {
      return property.value;
    }
  }
};

const getChartPropertyValue = (properties, propertyName, orElse = null) => {
  return getProperty(properties, propertyName, orElse);
};

const doesPropertyExists = (properties, propertyName) => {
  return !!getProperty(properties, propertyName);
};

const getFieldProperty = (fields, fieldOrder, propertyName, orElse) => {
  const field = fields.filter(function (item) {
    return item.fieldType.order === fieldOrder;
  })[0];

  if (!field) {
    return resolveOrElse(orElse);
  }

  return getProperty(field.properties, propertyName, orElse);
};

const getFieldPropertyValue = (fields, fieldOrder, propertyName, orElse = null) => {
  return getFieldProperty(fields, fieldOrder, propertyName, orElse);
};

const fieldPropertyExists = (fields, fieldOrder, propertyName) => {
  return !!getFieldPropertyValue(fields, fieldOrder, propertyName);
};

const haveFilter = (start, drilldowns, filters) => {
  for (let index = start + 1; index < drilldowns.length; index++) {
    const element = drilldowns[index];
    const filter = filters[element.feature.name] || filters[element.feature.name.toLowerCase()];
    if (filter && filter.length > 0) {
      return true;
    }
  }
  return false;
};

const drillDown = (drillDownFeature, hierarchy, filters) => {
  const filter = filters[drillDownFeature.feature.name] || filters[drillDownFeature.feature.name.toLowerCase()];
  if ((filter && filter.length > 0) || haveFilter(drillDownFeature.order, hierarchy.drilldown, filters)) {
    const next = hierarchy.drilldown[drillDownFeature.order + 1];
    if (next) {
      return drillDown(next, hierarchy, filters);
    }
  }
  return drillDownFeature.feature.name;
};

const constructDimensionField = (fieldDimension, filters) => {
  if (fieldDimension.hierarchy) {
    fieldDimension.hierarchy.drilldown = fieldDimension.hierarchy.drilldown.sort(function (a, b) {
      return a.order - b.order;
    });
    const featureDrillDown = fieldDimension.hierarchy.drilldown.filter(function (item, index) {
      return fieldDimension.feature.name === item.feature.name;
    })[0];

    if (featureDrillDown) {
      return { name: drillDown(featureDrillDown, fieldDimension.hierarchy, filters) };
    }
  }
  return { name: fieldDimension.feature.name };
};

const isDimension = item => {
  return item.feature && item.feature != null && item.feature.featureType === 'DIMENSION';
};

const isMeasure = item => {
  return item.feature && item.feature != null && item.feature.featureType === 'MEASURE';
};

const getDimension = item => {
  return item.sort(function (a, b) {
    return a.fieldType.order - b.fieldType.order;
  });
};

const constructMeasureField = fieldMeasure => {
  const agg = getProperty(fieldMeasure.properties, 'Aggregation type', null);
  if (agg !== null) {
    return {
      aggregation: agg !== 'NONE' ? agg : null,
      name: fieldMeasure.feature.definition,
      alias: fieldMeasure.feature.name,
    };
  } else {
    return {
      name: fieldMeasure.feature.definition,
    };
  }
};

const constructHavingField = fieldMeasure => {
  const agg = getProperty(fieldMeasure.properties, 'Aggregation type', null);
  if (agg !== null && agg !== 'NONE') {
    return { name: fieldMeasure.feature.definition, aggregation: agg };
  }
  return null;
};

const getQueryParametersWithFields = (fields, filters, conditionExpression) => {
  const query = {
    fields,
    conditionExpressions: null,
  };

  if (conditionExpression && conditionExpression.conditionExpression) {
    query.conditionExpressions = [conditionExpression];
  }
  if (query.conditionExpressions) {
    return query;
  } else {
    delete query['conditionExpressions'];
    return query;
  }
};

const getQueryParameters = (visual, filters, conditionExpression, offset) => {
  const fields = visual.fields;
  const dimensions = fields.filter(isDimension);

  const measures = fields.filter(isMeasure);

  const dimensionFields = dimensions.map(function (item) {
    const result = constructDimensionField(item, filters);
    item.feature.selectedName = result.name;
    return result;
  });

  const measureFields = measures.map(function (item) {
    return constructMeasureField(item);
  });

  let query;

  query = getQueryParametersWithFields(dimensionFields.concat(measureFields), filters, conditionExpression);

  if (visual.metadataVisual.name === 'Table' || visual.metadataVisual.name === 'Pivot Table') {
    query.offset = getChartPropertyValue('Limit', 20) * offset;
  }

  const aggExists = !!measureFields.filter(function (item) {
    return item.aggregation;
  })[0];

  if (aggExists) {
    query.groupBy = dimensionFields;
  }
  query.limit = getChartPropertyValue(visual.properties, 'Limit', 20);
  const ordersListSortMeasures = measures
    .filter(function (item) {
      const property = getProperty(item.properties, 'Sort', null);
      return property !== null && property !== 'None';
    })
    .map(function (item) {
      const property = getProperty(item.properties, 'Sort', null);
      if (property === 'Ascending') {
        return {
          direction: 'ASC',
          feature: { name: item.feature.name },
        };
      } else {
        return {
          direction: 'DESC',
          feature: { name: item.feature.name },
        };
      }
    });

  const ordersListSortDimensions = dimensions
    .filter(function (item) {
      const property = getProperty(item.properties, 'Sort', null);
      return property !== null && property !== 'None';
    })
    .map(function (item) {
      const property = getProperty(item.properties, 'Sort', null);
      if (property === 'Ascending') {
        return {
          direction: 'ASC',
          feature: { name: item.feature.selectedName },
        };
      } else {
        return {
          direction: 'DESC',
          feature: { name: item.feature.selectedName },
        };
      }
    });

  query.orders = ordersListSortMeasures.concat(ordersListSortDimensions);

  return query;
};

const hasDimension = (fields, dimensionName) => {
  return (
    fields.filter(function (item) {
      return item.feature && item.feature.name === dimensionName;
    }).length !== 0
  );
};

const getFieldDimensions = fields => {
  return fields.filter(function (item) {
    return item.fieldType.featureType === 'DIMENSION';
  });
};

const nextFieldMeasure = (fields, metadataVisual) => {
  const measureFields = fields.filter(function (item) {
    return item.fieldType.featureType === 'MEASURE';
  });

  const measureFieldTypes = metadataVisual.fieldTypes.filter(function (item) {
    return item.featureType === 'MEASURE';
  });
  return nextFeature(measureFields, measureFieldTypes);
};

export const VisualWrap = visual => {
  visual.getChartPropertyValue = getChartPropertyValue;
  visual.doesPropertyExists = doesPropertyExists;
  visual.fieldPropertyExists = fieldPropertyExists;
  visual.getFieldPropertyValue = getFieldPropertyValue;
  visual.getQueryParameters = getQueryParameters;
  visual.getQueryParametersWithFields = getQueryParametersWithFields;
  visual.hasDimension = hasDimension;
  visual.getFieldDimensions = getFieldDimensions;
  //   visual.canBuild = canBuild;
  //   visual.getSharePath = getSharePath;
  visual.nextFieldDimension = nextFieldDimension;
  visual.nextFieldMeasure = nextFieldMeasure;
  visual.constructHavingField = constructHavingField;
  return visual;
};
