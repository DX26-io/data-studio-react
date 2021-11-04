import { VisualWrap } from '../visualisation/util/visualmetadata-wrapper';
import { getConditionExpressionForParams } from '../filter/filter-util';
import { ISchedulerReport } from 'app/shared/model/scheduler-report.model';
import { IError, defaultValue } from 'app/shared/model/error.model';

export const SetDefaultWebHookList = (webHookList, webhook) => {
  const options = [];
  webhook?.forEach(element => {
    const data = webHookList?.find(x => x.id === element);
    if (data) {
      options.push({ value: data.id.toString(), label: data.webhookName });
    }
  });
  return options;
};
export const SetDefaulSelectedUserEmailList = (userList, userEmails) => {
  const options = [];
  userEmails?.forEach(element => {
    const data = userList?.find(x => `${x.login} ${x.email}` === `${element.userName} ${element.userEmail}`);
    if (data) {
      options.push({ value: `${data.login} ${data.email}`, label: `${data.login} ${data.email}` });
    }
  });
  return options;
};

export const GenerateWebhookOptions = data => {
  const options = [];
  data.forEach(element => {
    options.push({ value: element.id.toString(), label: element.webhookName });
  });
  return options;
};

export const GenerateUserOptions = data => {
  const options = [];
  data.forEach(element => {
    options.push({ value: `${element.login} ${element.email}`, label: `${element.login} s${element.email}` });
  });
  return options;
};

const getMeasureField = (visual, condition) => {
  const visualMetadata = VisualWrap(visual);
  return visual.fields
    .filter(function (item) {
      return item.feature.featureType === 'MEASURE' && item.feature.definition === condition.featureName?.label;
    })
    .map(function (item) {
      return visualMetadata.constructHavingField(item);
    })[0];
};

export const getDynamicAlertConditionalExpressions = (visual, condition) => {
  const visualMetadata = VisualWrap(visual);

  const featureData = {};
  const featureDefinition = condition.dynamicThreshold.dimension.definition;
  featureData[featureDefinition] = [condition.dynamicThreshold.value + ' ' + condition.dynamicThreshold.unit.value];
  const initialValue = condition.dynamicThreshold.unit.value === 'days' ? "__FLAIR_NOW('day', __FLAIR_NOW())" : '__FLAIR_NOW()';
  featureData[featureDefinition]._meta = {
    operator: '-',
    initialValue,
    endValue: '__FLAIR_NOW()',
    valueType: 'intervalValueType',
  };

  const featureData2 = {};
  const dimension = visualMetadata.getFieldDimensions()[0];
  const featureDef = dimension.feature.name;
  featureData2[featureDefinition] = ['A.' + featureDef, 'B.' + featureDef];
  featureData2[featureDefinition]._meta = {
    valueType: 'compare',
  };

  return [featureData, featureData2];
};

export const getHavingDTO = (visual, condition, selectedFilters) => {
  const visualMetadata = VisualWrap(visual);
  const havingField = getMeasureField(visual, condition);
  const havingDTO = {
    feature: havingField,
    operation: {
      '@type': 'scalar',
      value: condition.value,
      operations: {},
    },
    comparatorType: condition.compare.value?.value,
  };
  if (condition.thresholdMode === 'dynamic') {
    const dynamicAlertConditionalExpressions = getDynamicAlertConditionalExpressions(visual, condition);
    const conditionExpressionForParams = getConditionExpressionForParams(selectedFilters, dynamicAlertConditionalExpressions);
    const query = visualMetadata.getQueryParametersWithFields(
      [
        {
          name: condition.dynamicThreshold.field,
          aggregation: condition.dynamicThreshold.aggregation.opt,
          alias: condition.dynamicThreshold.field,
        },
      ],
      selectedFilters,
      conditionExpressionForParams
    );
    havingDTO.operation = {
      '@type': 'arithmetic',
      value: 'MULTIPLY',
      operations: [
        {
          '@type': 'query',
          value: query,
        },
        {
          '@type': 'scalar',
          value: (100 - condition.value) / 100,
        },
      ],
    };
  }
  return [havingDTO];
};

export const validateAndSetHaving = (schedulerReport, visual, condition, selectedFilters, setSchedulerReport) => {
  let flag = true;
  if (schedulerReport.report.thresholdAlert) {
    schedulerReport.queryDTO.having = getHavingDTO(visual, condition, selectedFilters);
    schedulerReport.queryDTO.having[0].feature ? (flag = true) : (flag = false);
    setSchedulerReport({ ...schedulerReport });
  }
  return flag;
};

export const assignTimeConditionsToScheduledObj = timeConditions => {
  if (!timeConditions.feature) {
    return '{}';
  }
  const _constraints = {
    time: {
      featureName: timeConditions.feature.definition,
      value: timeConditions.value,
      unit: timeConditions.unit.value,
    },
  };

  return JSON.stringify(_constraints);
};

export const getReportTitle = visual => {
  return visual.titleProperties.titleText;
};

export const getReportName = visual => {
  const reportName = visual.metadataVisual.name.split(' ').join('-') + '-' + visual.id;
  return reportName;
};

export const isFormValid = (scheduler: ISchedulerReport) => {
  let error = defaultValue;
  if (!scheduler.report?.reportName) {
    error = { translationKey: 'reportsManagement.reports.error.name', isValid: false };
    return error;
  } else if (scheduler.assignReport?.channels.length === 0) {
    error = { translationKey: 'reportsManagement.reports.error.channels', isValid: false };
    return error;
  } else if (scheduler.assignReport?.channels.includes('Email') && scheduler.assignReport?.communicationList?.emails.length === 0) {
    error = { translationKey: 'reportsManagement.reports.error.email', isValid: false };
    return error;
  } else if (scheduler.assignReport?.channels.includes('Teams') && scheduler.assignReport?.communicationList?.teams.length === 0) {
    error = { translationKey: 'reportsManagement.reports.error.teams', isValid: false };
    return error;
  } else if (!scheduler.report?.mailBody) {
    error = { translationKey: 'reportsManagement.reports.error.comments', isValid: false };
    return error;
  } else if (!scheduler.schedule?.cronExp) {
    error = { translationKey: 'reportsManagement.reports.error.cronExp', isValid: false };
    return error;
  }
  return error;
};
