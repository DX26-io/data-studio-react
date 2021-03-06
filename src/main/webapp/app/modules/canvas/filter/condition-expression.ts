import { IConditionExpression } from 'app/shared/model/condition-expression.model';
import uuid from 'react-uuid';

const conditionExpression = {
  expression: null,
  uuid: '',
};

export const ConditionExpression = (expression: IConditionExpression) => {
  conditionExpression.expression = expression || {
    '@type': 'Compare',
    comparatorType: 'EQ',
  };
  conditionExpression.uuid = uuid();
  return conditionExpression;
};

/**
 * Go through condition expression and apply changes to each node based on uuid
 *
 * @param {any} exp : expression where changes will be applied
 * @param {any} changes : list of new nodes that contain new changes
 * @returns changes expression
 */
const applyChanges = (exp: IConditionExpression, changes: any) => {
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
function depthFirstVisit(expression: any, visitors: any) {
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
    if (visitors instanceof Array) {
      visitors.forEach(function (visitor) {
        visitor(current, previous, previousLeaf, parent);
      });
    } else if (visitors instanceof Function) {
      visitors(current, previous, previousLeaf, parent);
    }
    previous = current;
    if (!current.firstExpression && !current.secondExpression) {
      previousLeaf = current;
    }
  }
}

export const addNewExpression = (condition: any, exp: any, type: string = null) => {
  const newExpression = { ...exp };
  newExpression.uuid = uuid();
  return {
    firstExpression: condition.expression,
    secondExpression: newExpression,
    '@type': type || 'And',
    uuid: uuid(),
  };
};
