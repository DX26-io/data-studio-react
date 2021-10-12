import React, { ReactText, useEffect, useState } from 'react';
import { Checkbox, CheckboxGroup, Form, TextField, View, TextArea, Flex, ButtonGroup, Button, RadioGroup, Radio } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { SCHEDULER_CHANNELS } from 'app/shared/util/Scheduler.constants';
import { getUsers, scheduleReport, getScheduleReportById, executeNow, setSchedulerReport, cancelScheduleReport } from 'app/modules/canvas/scheduler/scheduler.reducer';
import Select from 'react-select';
import DatePicker from 'app/shared/components/date-picker/date-picker';
import { stringToDate } from '../data-constraints/utils/date-util';
import { Translate } from 'react-jhipster';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { buildQueryDTO } from '../visualisation/util/visualisation-render-utils';
import { getWebhookList } from 'app/modules/canvas/scheduler/notification.reducer';
import { GenerateUserOptions, GenerateWebhookOptions, SetDefaulSelectedUserEmailList, SetDefaultWebHookList } from './scheduler.util';
import { ConditionDefaultValue, ConstraintsDefaultValue, ICondition, IConstraints, ITimeConditions, TimeConditionsDefaultValue } from 'app/shared/model/scheduler-report.model';
import { AGGREGATION_TYPES, COMPARABLE_DATA_TYPES, COMPARISIONS, TIME_UNIT } from 'app/shared/util/data-constraints.constants';
import { getDimensionsList, getMeasuresList } from 'app/entities/feature/feature.reducer';
import { getDimension } from '../visualisation/util/visualisation-utils';
import { VisualWrap } from '../visualisation/util/visualmetadata-wrapper';
import { getConditionExpressionForParams } from '../filter/filter-util';
import { width } from '@fortawesome/free-solid-svg-icons/faSort';
export interface ISchedulerProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
}

const Scheduler = (props: ISchedulerProps) => {
  const [condition, setCondition] = useState<ICondition>(ConditionDefaultValue);
  const [constraints, setConstraints] = useState<IConstraints>(ConstraintsDefaultValue);
  const [timeConditions, setTimeConditions] = useState<ITimeConditions>(TimeConditionsDefaultValue);

  useEffect(() => {
    props.getUsers();
    props.getWebhookList();
    props.getScheduleReportById(props.visual?.id);
  }, []);

  const setDimentionsAndMeasures = fields => {
    const dimensions = [];
    const measures = [];
    fields.filter(function (item) {
      if (item.feature.featureType === 'DIMENSION') {
        dimensions.push(item.feature.name);
      } else if (item.feature.featureType === 'MEASURE') {
        measures.push(item.feature.name);
      }
    });
    return {
      dimensions,
      measures,
    };
  };

  const executeReport = () => {
    props.executeNow(props.visual.id);
  };

  const getMeasureField = () => {
    const visualMetadata = VisualWrap(props.visual);
    return props.visual.fields
      .filter(function (item) {
        return item.feature.featureType === "MEASURE" && item.feature.definition === condition.featureName.label;
      })
      .map(function (item) {
        return visualMetadata.constructHavingField(item);
      })[0];
  }

  const getDynamicAlertConditionalExpressions = () => {
    const visualMetadata = VisualWrap(props.visual);

    const featureData = {};
    const featureDefinition = condition.dynamicThreshold.dimension.definition;
    featureData[featureDefinition] = [
      condition.dynamicThreshold.value + ' ' + condition.dynamicThreshold.unit.value
    ];
    const initialValue = condition.dynamicThreshold.unit.value === 'days' ?
      "__FLAIR_NOW('day', __FLAIR_NOW())" :
      '__FLAIR_NOW()';
    featureData[featureDefinition]._meta = {
      operator: '-',
      initialValue,
      endValue: '__FLAIR_NOW()',
      valueType: 'intervalValueType'
    };

    const featureData2 = {};
    const dimension = visualMetadata.getFieldDimensions()[0];
    const featureDef = dimension.feature.name;
    featureData2[featureDefinition] = ['A.' + featureDef, 'B.' + featureDef];
    featureData2[featureDefinition]._meta = {
      valueType: 'compare'
    };

    return [featureData, featureData2];
  }


  const getHavingDTO = () => {
    const visualMetadata = VisualWrap(props.visual);
    const havingField = getMeasureField();
    const havingDTO = {
      feature: havingField,
      operation: {
        '@type': 'scalar',
        value: condition.value,
        operations: {}
      },
      comparatorType: condition.compare.value
    };
    if (condition.thresholdMode === 'dynamic') {
      const dynamicAlertConditionalExpressions = getDynamicAlertConditionalExpressions();
      const conditionExpressionForParams = getConditionExpressionForParams(props.selectedFilters, dynamicAlertConditionalExpressions);
      const query = visualMetadata.getQueryParametersWithFields(
        [{
          name: condition.dynamicThreshold.field,
          aggregation: condition.dynamicThreshold.aggregation.opt,
          alias: condition.dynamicThreshold.field
        }],
        props.selectedFilters,
        conditionExpressionForParams
      );
      havingDTO.operation = {
        '@type': 'arithmetic',
        "value": 'MULTIPLY',
        operations: [
          {
            '@type': 'query',
            value: query,
          },
          {
            '@type': 'scalar',
            value: (100 - condition.value) / 100,
          }
        ]
      };
    }
    return [havingDTO];
  }


  const validateAndSetHaving = () => {
    let flag = true;
    if (props.schedulerReport.report.thresholdAlert) {
      props.schedulerReport.queryDTO.having = getHavingDTO();
      props.schedulerReport.queryDTO.having[0].feature ? flag = true : flag = false;
      props.setSchedulerReport({ ...props.schedulerReport });
    }
    return flag;
  }

  const assignTimeConditionsToScheduledObj = () => {
    if (!timeConditions.feature) {
      return;
    }
    const _constraints = {
      time: {
        featureName: timeConditions.feature.definition,
        value: timeConditions.value,
        unit: timeConditions.unit.value
      }
    };

    return JSON.stringify(_constraints);
  }

  const saveScheduleReport = () => {
    // TODO : this is not the best practice..will be refactored in near future
    const dimentionsAndMeasures = setDimentionsAndMeasures(props.visual.fields);
    validateAndSetHaving();
    props.scheduleReport({
      ...props.schedulerReport,
      report: {
        dashboardName: props.view.viewDashboard.dashboardName,
        viewName: props.view.viewName,
        viewId: props.view.id,
        shareLink: 'shareLink',
        buildUrl: 'buildUrl',
        thresholdAlert: false,
        userId: '',
        connectionName: '',
        sourceId: 0,
        reportName: props.schedulerReport.report.titleName,
        mailBody: props.schedulerReport.report.mailBody,
        subject: '',
        titleName: ''
      },
      datasourceId: props.view.viewDashboard.dashboardDatasource.id,
      dashboardId: props.view.viewDashboard.id.toString(),
      putCall: props.schedulerReport?.reportLineItem.visualisationId ? true : false,
      constraints: assignTimeConditionsToScheduledObj(),
      reportLineItem: {
        visualisationId: props.visual.id,
        visualisationType: props.visual.metadataVisual.name,
        dimensions: dimentionsAndMeasures.dimensions,
        measures: dimentionsAndMeasures.measures,
      },
      queryDTO: buildQueryDTO(props.visual, props.filters),
    });
  };


  return (
    <>
      <Flex direction="column" gap="size-100">
        <View>
          <Flex direction="column" alignItems="end">
            <View>
              <ButtonGroup>
                <Button variant="secondary" onPress={() => {
                  props.cancelScheduleReport(props.visual.id);
                }}>
                  <Translate contentKey="entity.action.cancel">Cancel</Translate>
                </Button>
                <Button
                  onPress={() => {
                    saveScheduleReport();
                  }}
                  variant="cta"
                >
                  <Translate contentKey="entity.action.create">Create</Translate>
                </Button>
                {props.schedulerReport?.reportLineItem.visualisationId && (
                  <Button
                    onPress={() => {
                      executeReport();
                    }}
                    variant="cta"
                  >
                    <Translate contentKey="entity.action.runnow">Run Now</Translate>
                  </Button>
                )}
              </ButtonGroup>
            </View>
          </Flex>
        </View>
        <View>
          <Form>
            <TextField value={props.schedulerReport?.report?.titleName} label="Report Name" placeholder="Report Name"
              onChange={event => {
                props.schedulerReport.report.titleName = event
                props.setSchedulerReport({ ...props.schedulerReport });
              }}
            />
            <CheckboxGroup label="Channels" orientation="horizontal" value={props.schedulerReport?.assignReport?.channels}
              onChange={(event) => {
                props.schedulerReport.assignReport.channels = event;
                props.setSchedulerReport({ ...props.schedulerReport });

              }}>
              {SCHEDULER_CHANNELS.map(item => {
                return (
                  <Checkbox
                    value={item.key}
                    key={item.key}
                  >
                    {item.key}
                  </Checkbox>
                );
              })}
            </CheckboxGroup>
            <p>Share Report with Users </p>
            <Select
              onChange={(value, actionMeta) => {
                const emails = props.schedulerReport.assignReport.communicationList.emails;
                if (actionMeta.action === 'select-option') {
                  emails.push({ userName: actionMeta.option.value.split(' ')[0], userEmail: actionMeta.option.value.split(' ')[1] });
                  props.schedulerReport.assignReport.communicationList.emails = emails;
                  props.setSchedulerReport({ ...props.schedulerReport });
                } else if (actionMeta.action === 'remove-value') {
                  const filterEmails = emails.filter(element => {
                    if (`${element.userName} ${element.userEmail}` !== actionMeta.removedValue.value) {
                      return element;
                    }
                  });
                  props.schedulerReport.assignReport.communicationList.emails = filterEmails;
                  props.setSchedulerReport({ ...props.schedulerReport });
                }
              }}
              label="Share Report with Users"
              isMulti
              options={GenerateUserOptions(props.users)}
              className="basic-multi-select"
              classNamePrefix="select"
              value={SetDefaulSelectedUserEmailList(props.users, props.schedulerReport?.assignReport?.communicationList?.emails)}
            />
            <p>Select Webhooks </p>

            <Select
              onChange={(value, actionMeta) => {
                const teams = props.schedulerReport.assignReport.communicationList.teams || [];
                if (actionMeta.action === 'select-option') {
                  teams.push(Number(actionMeta.option.value));
                } else if (actionMeta.action === 'remove-value') {
                  const postion = teams.indexOf(Number(actionMeta.removedValue.value));
                  teams.splice(postion, 1);
                }
                props.schedulerReport.assignReport.communicationList.teams = teams;
                props.setSchedulerReport({ ...props.schedulerReport });
              }}
              label="Share Report with Users"
              isMulti
              options={GenerateWebhookOptions(props.webHooks)}
              className="basic-multi-select"
              classNamePrefix="select"
              value={SetDefaultWebHookList(props.webHooks, props.schedulerReport?.assignReport?.communicationList?.teams)}

            />

            <TextArea value={props.schedulerReport?.report?.mailBody} label="Comments"
              onChange={event => {
                props.schedulerReport.report.mailBody = event
                props.setSchedulerReport({ ...props.schedulerReport });
              }}
            />

            {
              props.schedulerReport.report.thresholdAlert && (
                <>
                  <RadioGroup orientation="horizontal" label="Threshold Type" onChange={(event) => {
                    condition.thresholdMode = event
                    setCondition({ ...condition });
                  }} value={condition?.thresholdMode} isEmphasized>
                    <Radio value="Absolute">Absolute</Radio>
                    <Radio value="Dynamic">Dynamic</Radio>
                  </RadioGroup>

                  <div className='threshold' style={{}}>
                    {condition?.thresholdMode === 'Dynamic' && (

                      <Flex direction="row" gap="size-150" alignItems="start" >
                        <View width={'20%'} >
                          <span>
                            <Translate contentKey="scheduler.threshold.thresholdField">Threshold field*</Translate>
                          </span>
                          <Select
                            className='threshold'
                            styles={{ width: 1000 }}
                            isSearchable={true}
                            name="color"
                            value={condition?.featureName}
                            onChange={(event) => {
                              condition.featureName = event
                              setCondition({ ...condition })
                            }}
                            options={getMeasuresList(props?.visual?.fields?.filter((item) => { return item.feature.featureType === "MEASURE" }))} />
                        </View>

                        <View width={'20%'} >
                          <span>
                            <Translate contentKey="scheduler.threshold.aggType">Agg.type*</Translate>
                          </span>
                          <Select
                            isSearchable={true}
                            name="color"
                            value={condition?.compare?.value}
                            onChange={(event) => {
                              condition.compare.value = event
                              setCondition({ ...condition })
                            }}
                            options={AGGREGATION_TYPES} />
                        </View>



                        <View width={'20%'} >
                          <span>
                            <Translate contentKey="scheduler.threshold.dimension">Dimension*</Translate>
                          </span>
                          <Select
                            isSearchable={true}
                            name="color"
                            onChange={(event) => {
                              if (timeConditions?.feature?.definition) {
                                timeConditions.feature.definition = event
                              }
                              setCondition({ ...condition })
                            }}
                            value={timeConditions?.feature?.definition}
                            options={getDimensionsList(props.features.filter((feature) => { return COMPARABLE_DATA_TYPES.includes(feature.type) !== false }))} />
                        </View>
                        <View width={'20%'} >
                          <span>
                            <Translate contentKey="scheduler.threshold.unit">Unit*</Translate>
                          </span>
                          <Select
                            isSearchable={true}
                            name="TIME_UNIT"
                            onChange={(event) => {
                              timeConditions.unit = event
                              setCondition({ ...condition })
                            }}
                            value={timeConditions?.unit}
                            options={TIME_UNIT} />
                        </View>
                        <View width={'20%'} >

                          <TextField label="Value" value={condition?.value?.toString() || ''}
                            onChange={(event) => {
                              condition.value = event
                              setCondition({ ...condition })
                            }}
                          />
                        </View>
                      </Flex>
                    )}
                    <Flex direction='row' gap="size-150" >
                      <View width={'33%'} >
                        <span>
                          <Translate contentKey="scheduler.threshold.measure">Measure*</Translate>
                        </span>
                        <Select
                          styles={{ width: 1000 }}
                          isSearchable={true}
                          name="color"
                          value={condition?.featureName}
                          onChange={(event) => {
                            condition.featureName = event
                            setCondition({ ...condition })
                          }}
                          options={getMeasuresList(props?.visual?.fields?.filter((item) => { return item.feature.featureType === "MEASURE" }))} />
                      </View>
                      <View width={'33%'} >
                        <span>
                          <Translate contentKey="scheduler.threshold.compare">Compare*</Translate>
                        </span>
                        <Select
                          isSearchable={true}
                          name="color"
                          label="Compare*"
                          value={condition?.compare?.value}
                          onChange={(event) => {
                            condition.compare.value = event
                            setCondition({ ...condition })
                          }}
                          options={COMPARISIONS} />
                      </View>
                      <View width={'33%'} >
                        <TextField label={'Threshold'} value={condition?.value?.toString() || ''}
                          onChange={(event) => {
                            condition.value = event
                            setCondition({ ...condition })
                          }}
                        />
                      </View>
                    </Flex>
                    <Flex direction='row' gap="size-150" >
                      <View width={'33%'} >
                        <span>
                          <Translate contentKey="scheduler.threshold.dimension">Dimension*</Translate>
                        </span>
                        <Select
                          isSearchable={true}
                          name="color"
                          onChange={(event) => {
                            if (timeConditions?.feature?.definition) {
                              timeConditions.feature.definition = event
                            }
                            setCondition({ ...condition })
                          }}
                          value={timeConditions?.feature?.definition}
                          options={getDimensionsList(props.features.filter((feature) => { return COMPARABLE_DATA_TYPES.includes(feature.type) !== false }))} />
                      </View>
                      <View width={'33%'} >
                        <span>
                          <Translate contentKey="scheduler.threshold.unit">Unit*</Translate>
                        </span>
                        <Select
                          isSearchable={true}
                          name="TIME_UNIT"
                          onChange={(event) => {
                            timeConditions.unit = event
                            setCondition({ ...condition })
                          }}
                          value={timeConditions?.unit}
                          options={TIME_UNIT} />
                      </View>
                      <View width={'33%'} >
                        <TextField label={'Value'} value={timeConditions?.value?.toString() || ''}
                          onChange={(event) => {
                            timeConditions.value = Number(event)
                            setCondition({ ...condition })
                          }}
                        />
                      </View>
                    </Flex>
                  </div>
                </>
              )
            }


            <TextField label="cron expression" value={props.schedulerReport.schedule.cronExp}
              onChange={event => {
                props.schedulerReport.schedule.cronExp = event
                props.setSchedulerReport({ ...props.schedulerReport });
              }}
            />
            <DatePicker label="Start Date" value={stringToDate(props.schedulerReport?.schedule?.startDate || '')}
              onChange={event => {
                props.schedulerReport.schedule.startDate = event
                props.setSchedulerReport({ ...props.schedulerReport });
              }}
            />
            <DatePicker label="End Date" value={stringToDate(props.schedulerReport?.schedule?.endDate || '')}
              onChange={event => {
                props.schedulerReport.schedule.endDate = event
                props.setSchedulerReport({ ...props.schedulerReport });
              }}
            />
          </Form>
        </View>
      </Flex>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.scheduler.users,
  schedulerReport: storeState.scheduler.schedulerReport,
  webHooks: storeState.notification.webHooks,
  view: storeState.views.entity,
  account: storeState.authentication.account,
  filters: storeState.filter.selectedFilters,
  features: storeState.feature.entities,
  selectedFilters: storeState.filter.selectedFilters,
});

const mapDispatchToProps = { executeNow, getUsers, scheduleReport, getWebhookList, setSchedulerReport, getScheduleReportById, cancelScheduleReport };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
