import React, { FC, ReactText, useEffect, useRef, useState } from 'react';
import { ActionButton, Button, Flex, Item, Picker, TextField, View } from '@adobe/react-spectrum';
import { IFeature } from 'app/shared/model/feature.model';
import { IDatasources } from 'app/shared/model/datasources.model';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import uuid from 'react-uuid';
import {
  COMPARABLE_DATA_TYPES,
  COMPARE_TYPES,
  CONDITION_TYPES,
  SIMPLE_DATE_TYPES_FOR_DATES,
  SIMPLE_DATE_TYPES_OTHER,
} from 'app/shared/util/data-constraints.constants';
import AddCircle from '@spectrum-icons/workflow/AddCircle';
import RemoveCircle from '@spectrum-icons/workflow/RemoveCircle';
import './visualization-data-constraints.scss';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { forwardCall } from 'app/shared/websocket/proxy-websocket.service';
import { resetTimezoneData } from 'app/modules/canvas/data-constraints/utils/date-util';
import DateRangeComponent from './date-range-component';
import { checkIsDateType, getDimension } from '../visualization/util/visualization-utils';
import { updateConditionExpression } from 'app/entities/visualmetadata/visualmetadata.reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

interface IVisualizationDataConstraintsProps extends StateProps, DispatchProps {
  features: readonly IFeature[];
  datasource: IDatasources;
  visualMetaData: IVisualMetadataSet;
  condition: any;
  filterData: any;
}

const VisualizationDataConstraints: FC<IVisualizationDataConstraintsProps> = props => {
  const [property, setProperty] = useState([]);
  const [conditionList, setConditionList] = useState(CONDITION_TYPES);
  const [isDisplayDateRange, setDisplayDateRange] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const simpleTypes = CONDITION_TYPES.filter(function (item) {
    return item.type === 'simple';
  });
  const compositeTypes = CONDITION_TYPES.filter(function (item) {
    return item.type === 'composite';
  });
  const dateRangeSupportedTypes = simpleTypes.filter(function (item) {
    return SIMPLE_DATE_TYPES_FOR_DATES.includes(item['@type']);
  });
  const dateRangeUnsupportedTypes = simpleTypes.filter(function (item) {
    return SIMPLE_DATE_TYPES_OTHER.includes(item['@type']);
  });

  const mapOptionsToValues = (options, inputValue) => {
    if (inputValue !== '') {
      return options.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));
    }
    return options;
  };

  const getComparatorType = data => {
    props.condition['@type'] = data;
    setProperty([props.condition['@type']]);
    setSelectedCondition(data);
  };
  const onDateChange = (fromDate, toDate, metadata) => {
    if (fromDate && toDate) {
      const dimension = getDimension(props.features, props.condition.featureName);
      fromDate = resetTimezoneData(fromDate);
      toDate = resetTimezoneData(toDate);
      props.condition.valueType = { value: fromDate, type: dimension.type, '@type': 'valueType' };
      props.condition.secondValueType = { value: toDate, type: dimension.type, '@type': 'valueType' };
      props.condition.metadata = metadata;
    }
  };

  const load = (q, dimension) => {
    const vId = 1298;
    const query = {
      fields: null,
      distinct: true,
    };
    query.fields = [{ name: dimension }];
    forwardCall(
      63550,
      {
        queryDTO: query,
        vId,
        type: 'filters',
      },
      vId
    );
  };
  const handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    return inputValue;
  };
  const getCompareDefaultValues = condition => {
    return (
      <>
        <Picker marginX={5} selectedKey={condition?.comparatorType} items={COMPARE_TYPES}>
          {item => <Item key={item['value']}>{item.displayName}</Item>}
        </Picker>
      </>
    );
  };
  const getCompareOrLikeDefaultValues = condition => {
    return <TextField marginX={5} value={condition?.valueType.value || ''} />;
  };
  const loadOptions = (inputValue, callback) => {
    if (props.filterData) {
      const dimensions = Object.keys(props.filterData);
      if (!dimensions.includes(props.condition.featureName)) {
        callback(load(inputValue, props.condition.featureName));
      } else {
        if (props.filterData[props.condition.featureName].length > 100 && inputValue !== '') {
          callback(load(inputValue, props.condition.featureName));
        } else {
          callback(mapOptionsToValues(props.filterData[props.condition.featureName], inputValue));
        }
      }
    } else {
      callback(load(inputValue, props.condition.featureName));
    }
  };

  const handleChange = (value, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      const dimension = getDimension(props.features, props.condition.featureName);
      props.condition.valueTypes.push({
        '@type': 'valueType',
        value: actionMeta.option.value,
        type: dimension.type,
      });
      props.condition.values = [];
      props.condition.valueTypes.forEach(item => {
        props.condition.values.push(item.value);
      });
    } else if (actionMeta.action === 'remove-value') {
      props.condition?.values.splice(props.condition?.values.indexOf(actionMeta.removedValue.value), 1);
    }
  };

  const getComparisonTypes = condition => {
    props.condition.featureName = condition;
    setProperty([props.condition.featureName]);
    const dimension = getDimension(props.features, condition);
    if (!dimension) {
      return [];
    }
    const dataType = dimension.type;
    const isDateType = COMPARABLE_DATA_TYPES.includes(dataType.toLowerCase());
    setDisplayDateRange(isDateType);
    if (isDateType) {
      setConditionList(dateRangeSupportedTypes);
    } else {
      setConditionList(dateRangeUnsupportedTypes);
    }
  };

  const getContainDefaultValues = condition => {
    const data = [];
    condition?.values?.map(item => {
      data.push({
        value: item,
        label: item,
      });
    });
    return (
      <>
        <AsyncSelect
          cacheOptions
          isMulti
          isSearchable={true}
          className="basic-multi-select data-constraints-select"
          classNamePrefix="select"
          defaultValue={data}
          loadOptions={loadOptions}
          defaultOptions
          onInputChange={handleInputChange}
          onChange={handleChange}
        />
      </>
    );
  };
  const applyChanges = (exp, changes) => {
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

  const depthFirstVisit = (expression, visitors) => {
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

      /*
            it is leaf if it does not have this elements
        */
      if (!current.firstExpression && !current.secondExpression) {
        previousLeaf = current;
      }
    }
  };
  const addComposition = condition => {
    const changes = [];
    depthFirstVisit(props.visualMetaData.conditionExpression, function (current, previous, previousLeaf, parent) {
      if (current.uuid === condition.uuid) {
        const newCurrent = {
          uuid: null,
          firstExpression: { ...current },
          '@type': 'Or',
          secondExpression: {
            uuid: uuid(),
            '@type': 'Compare',
            comparatorType: 'EQ',
            valueType: {
              '@type': 'valueType',
              value: '',
              type: '',
            },
            valueTypes: [],
          },
        };
        newCurrent.uuid = current.uuid;
        newCurrent.firstExpression.uuid = uuid();
        changes.push(newCurrent);
      }
    });
    const conditionExpression = applyChanges(props.visualMetaData.conditionExpression, changes);
    props.updateConditionExpression(props.visualMetaData, conditionExpression)
  };

  const removeCondition = condition => {
    if (props.visualMetaData.conditionExpression.uuid === condition.uuid) {
      props.updateConditionExpression(props.visualMetaData, null)
    } else {
      const changes = [];
      depthFirstVisit(props.visualMetaData.conditionExpression, function (current, previous, previousLeaf, parent) {
        if (current.uuid === condition.uuid) {
          let newParent;
          if (parent.firstExpression && parent.firstExpression.uuid === condition.uuid) {
            newParent = { ...parent.secondExpression };
          } else if (parent.secondExpression && parent.secondExpression.uuid === condition.uuid) {
            newParent = { ...parent.firstExpression };
          }
          if (newParent) {
            newParent.uuid = parent.uuid;
            changes.push(newParent);
          }
        }
      });
      const conditionExpression = applyChanges(props.visualMetaData.conditionExpression, changes);
      props.updateConditionExpression(props.visualMetaData, conditionExpression)
    }
  };
  const loadComponent = condition => {
    return (
      <>
        <Flex direction="column" gap="size-100">
          <div className={'condition-row'}>
            <View>
              <Picker
                marginX={5}
                onSelectionChange={key => {
                  getComparisonTypes(key);
                }}
                selectedKey={condition.featureName || ''}
              >
                {props.features &&
                  props.features.length > 0 &&
                  props.features.map(feature => <Item key={feature.name}>{feature.name}</Item>)}
              </Picker>
              <Picker
                marginX={5}
                onSelectionChange={key => {
                  getComparatorType(key);
                }}
                selectedKey={condition['@type']}
                items={conditionList}
              >
                {item => <Item key={item['@type']}>{item.displayName}</Item>}
              </Picker>
              {/* <TextField marginX={5} value={props.condition?.values?.toString() || ''} /> */}

              {condition['@type'] === 'Compare' && getCompareDefaultValues(condition)}
              {(condition['@type'] === 'Compare' || condition['@type'] === 'Like') && getCompareOrLikeDefaultValues(condition)}

              {(condition['@type'] === 'Contains' || condition['@type'] === 'NotContains') && getContainDefaultValues(condition)}

              {condition['@type'] === 'Between' && checkIsDateType(getDimension(props.features, condition.featureName)) && (
                <DateRangeComponent condition={condition} onDateChange={onDateChange} />
              )}

              <ActionButton
                onPress={() => {
                  addComposition(condition);
                }}
                isQuiet={true}
              >
                <AddCircle />
              </ActionButton>
              <ActionButton
                onPress={() => {
                  removeCondition(condition);
                }}
                isQuiet={true}
              >
                <RemoveCircle />
              </ActionButton>
            </View>
          </div>
        </Flex>
      </>
    );
  };

  const showCondition = condition => {
    return (
      <>
        <VisualizationDataConstraints
          features={props.features}
          datasource={props.datasource}
          visualMetaData={props.visualMetaData}
          condition={condition}
          filterData={props.filterData} updateConditionExpression={props.updateConditionExpression}           ></VisualizationDataConstraints>
      </>
    );
  };

  const loadCondition = condition => {
    return (
      <div className={condition['@type'] === 'Or' || condition['@type'] === 'And' ? 'condition-component-wrapper' : ''}>
        {condition && (condition['@type'] === 'Or' || condition['@type'] === 'And') && showCondition(condition.firstExpression)}

        {condition && (condition['@type'] === 'Or' || condition['@type'] === 'And') && (
          <>
            <Picker margin={5} selectedKey={condition['@type']} items={compositeTypes}>
              {item => <Item key={item['@type']}>{item.displayName}</Item>}
            </Picker>
          </>
        )}

        {condition && (condition['@type'] === 'Or' || condition['@type'] === 'And') && showCondition(condition.secondExpression)}
      </div>
    );
  };

  const addStartingCondition = () => {
    const conditionExpression = {
      uuid: uuid(),
      '@type': 'Compare',
      comparatorType: 'EQ',
      valueType: {
        '@type': 'valueType',
        value: '',
        type: '',
      },
      valueTypes: [],
    }
    props.updateConditionExpression(props.visualMetaData, conditionExpression);
  };

  return (
    <>
      {props.visualMetaData.conditionExpression === null && (
        <Button
          variant="cta"
          onPress={() => {
            addStartingCondition();
          }}
        >
          Add Condition
        </Button>
      )}

      {props.condition && (props.condition['@type'] === 'Or' || props.condition['@type'] === 'And') && loadCondition(props.condition)}

      {props.condition && props.condition['@type'] !== 'Or' && props.condition['@type'] !== 'And' && loadComponent(props.condition)}
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
});
const mapDispatchToProps = {
  updateConditionExpression,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationDataConstraints);

