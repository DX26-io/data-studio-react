import {
  COMPARABLE_DATA_TYPES,
  COMPARE_TYPES,
  CONDITION_TYPES,
  SIMPLE_DATE_TYPES_FOR_DATES,
  SIMPLE_DATE_TYPES_OTHER,
} from 'app/shared/util/data-constraints.constants';

export const getDimension = (features, condition) => {
  return features.find(element => {
    return element.name === condition.featureName;
  });
};

const getConditionTypesOptions = () => {
  const options = [];
  CONDITION_TYPES.forEach(function (option) {
    options.push({ value: option, label: option.displayName });
  });
  return options;
};

export const getCompareTypeOptions = () => {
  const options = [];
  COMPARE_TYPES.forEach(function (option) {
    options.push({ value: option.value, label: option.displayName });
  });
  return options;
};

export const simpleTypes = getConditionTypesOptions().filter(item => {
  return item.value.type === 'simple';
});

export const COMPOSITE_TYPES = getConditionTypesOptions().filter(item => {
  return item.value.type === 'composite';
});

const dateRangeSupportedTypes = simpleTypes.filter(item => {
  return SIMPLE_DATE_TYPES_FOR_DATES.includes(item.value['@type']);
});
const dateRangeUnsupportedTypes = simpleTypes.filter(item => {
  return SIMPLE_DATE_TYPES_OTHER.includes(item.value['@type']);
});

export const isDateType = dataType => {
  return COMPARABLE_DATA_TYPES.includes(dataType.toLowerCase());
};

export const getComparisonTypes = dataType => {
  if (isDateType(dataType)) {
    return dateRangeSupportedTypes;
  } else {
    return dateRangeUnsupportedTypes;
  }
};

export const getContainsValues = conditionExpression => {
  const options = [];
  conditionExpression?.values?.map(item => {
    options.push({
      value: item,
      label: item,
    });
  });
  return options;
};

/**
 * Go through condition expression and apply changes to each node based on uuid
 *
 * @param {any} exp : expression where changes will be applied
 * @param {any} changes : list of new nodes that contain new changes
 * @returns changes expression
 */
export const applyChanges = (exp, changes) => {
  let expression = { ...exp };
  const element = changes.filter(function (item) {
    return item.uuid === expression.uuid;
  })[0];
  if (element) {
    expression = element;
    changes.splice(changes.indexOf(element), 1);
    return expression;
  }
  if (expression.firstExpression) {
    expression.firstExpression = applyChanges(expression.firstExpression, changes);
  }
  if (expression.secondExpression) {
    expression.secondExpression = applyChanges(expression.secondExpression, changes);
  }
  return expression;
};

/**
 *
 * Iterate though condition expression and apply visitors
 *
 * @param {any} expression root expression
 * @param {any} visitors list of functions to be called on each node
 */
export const depthFirstVisit = (expression, visitors) => {
  const stack = [expression];
  let current, previous, previousLeaf, parent;

  while (stack.length > 0) {
    current = stack.pop();
    if (current.secondExpression) {
      current.secondExpression.parent = current;
      stack.push(current.secondExpression);
    }
    if (current.firstExpression) {
      current.firstExpression.parent = current;
      stack.push(current.firstExpression);
    }

    parent = current.parent;
    delete current.parent;
    // process node
    if (visitors instanceof Array) {
      visitors.forEach(function (visitor) {
        visitor(current, previous, previousLeaf, parent);
      });
    } else if (visitors instanceof Function) {
      visitors(current, previous, previousLeaf, parent);
    }
    previous = current;
    /*  it is leaf if it does not have this elements  */
    if (!current.firstExpression && !current.secondExpression) {
      previousLeaf = current;
    }
  }
};


