import React, { ReactText, useEffect, useState } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  Form,
  TextField,
  View,
  TextArea,
  Flex,
  ButtonGroup,
  Button,
  RadioGroup,
  Radio,
  Text,
} from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { SCHEDULER_CHANNELS } from 'app/shared/util/Scheduler.constants';
import {
  getUsers,
  scheduleReport,
  getScheduleReportById,
  executeNow,
  setSchedulerReport,
  cancelScheduleReport,
  reset,
} from 'app/modules/canvas/scheduler/scheduler.reducer';
import Select from 'react-select';
import DatePicker from 'app/shared/components/date-picker/date-picker';
import { stringToDate } from '../data-constraints/utils/date-util';
import { Translate } from 'react-jhipster';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { buildQueryDTO } from '../visualisation/util/visualisation-render-utils';
import { getWebhookList } from 'app/modules/canvas/scheduler/notification.reducer';
import {
  GenerateUserOptions,
  GenerateWebhookOptions,
  getHavingDTO,
  SetDefaulSelectedUserEmailList,
  SetDefaultWebHookList,
  validateAndSetHaving,
  assignTimeConditionsToScheduledObj,
  getReportTitle,
  getReportName,
  isFormValid,
} from './scheduler.util';
import ThresholdAlert from 'app/modules/threshold-alert/thresholdAlert';
import { toast } from 'react-toastify';
import {
  getShareLinkUrl,
  getBuildUrl,
} from 'app/modules/canvas/visualisation/visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';
import { IError, defaultValue } from 'app/shared/model/error.model';
import Alert from '@spectrum-icons/workflow/Alert';

export interface ISchedulerProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
  thresholdAlert: boolean;
}

const Scheduler = (props: ISchedulerProps) => {
  const [error, setError] = useState(defaultValue);

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

  useEffect(() => {
    if (props.updateSuccess) {
      props.reset();
    }
  }, [props.updateSuccess]);

  const saveScheduleReport = () => {
    // TODO : this is not the best practice..will be refactored in near future
    const dimentionsAndMeasures = setDimentionsAndMeasures(props.visual.fields);
    validateAndSetHaving(props.schedulerReport, props.visual, props.condition, props.selectedFilters, setSchedulerReport);
    const queryDTO = buildQueryDTO(props.visual, props.filters);
    if (props.thresholdAlert) {
      queryDTO.having = getHavingDTO(props.visual, props.condition, props.selectedFilters);
    }
    props.scheduleReport({
      ...props.schedulerReport,
      report: {
        dashboardName: props.view.viewDashboard.dashboardName,
        viewName: props.view.viewName,
        viewId: props.view.id,
        shareLink: getShareLinkUrl(props.view, props.visual.id),
        buildUrl: getBuildUrl(props.view.viewDashboard.id, props.view.id),
        thresholdAlert: false,
        userId: '',
        connectionName: '',
        sourceId: props.view.viewDashboard.dashboardDatasource.id,
        reportName: props.schedulerReport.report.reportName,
        mailBody: props.schedulerReport.report.mailBody,
        subject: '',
        titleName: getReportTitle(props.visual),
      },
      datasourceId: props.view.viewDashboard.dashboardDatasource.id,
      dashboardId: props.view.viewDashboard.id.toString(),
      putCall: props.schedulerReport?.reportLineItem.visualizationId ? true : false,
      // constraints: assignTimeConditionsToScheduledObj(props.timeConditions),
      constraints: '{}',
      reportLineItem: {
        visualizationId: props.visual.id,
        visualisationType: props.visual.metadataVisual.name,
        dimensions: dimentionsAndMeasures.dimensions,
        measures: dimentionsAndMeasures.measures,
      },
      queryDTO,
    });
  };

  return (
    <>
      <Flex direction="column" gap="size-100">
        <View>
          <Flex direction="row" justifyContent="space-between">
            <Flex>
              {(!error.isValid || props.scheduleReportresponse?.message) && (
                <span className="spectrum-Body-emphasis">
                  {error.isValid ? props.scheduleReportresponse?.message : <Translate contentKey={error.translationKey}></Translate>}
                </span>
              )}
            </Flex>
            <Flex>
              <View>
                <ButtonGroup>
                  <Button
                    variant="negative"
                    onPress={() => {
                      props.cancelScheduleReport(props.visual.id);
                    }}
                  >
                    <Translate contentKey="entity.action.cancel">Cancel</Translate>
                  </Button>
                  <Button onPress={saveScheduleReport} variant="cta" isDisabled={props.updating}>
                    <Translate contentKey="entity.action.save">Create</Translate>
                  </Button>
                  {props.schedulerReport?.reportLineItem.visualizationId && (
                    <Button onPress={executeReport} variant="cta">
                      <Translate contentKey="entity.action.runnow">Run Now</Translate>
                    </Button>
                  )}
                </ButtonGroup>
              </View>
            </Flex>
          </Flex>
        </View>
        <View>
          <Form>
            <TextField
              value={props.schedulerReport?.report?.reportName}
              label="Report Name*"
              placeholder="Report Name"
              onChange={event => {
                props.schedulerReport.report.reportName = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                setError(errorObj);
              }}
            />
            <CheckboxGroup
              label="Channels*"
              orientation="horizontal"
              value={props.schedulerReport?.assignReport?.channels}
              onChange={event => {
                props.schedulerReport.assignReport.channels = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                setError(errorObj);
              }}
            >
              {SCHEDULER_CHANNELS.map(item => {
                return (
                  <Checkbox value={item.key} key={item.key}>
                    {item.key}
                  </Checkbox>
                );
              })}
            </CheckboxGroup>
            {props.schedulerReport.assignReport.channels.includes('Email') ? (
              <React.Fragment>
                <p>Share Report with Users*</p>
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
                      props.setSchedulerReport(props.schedulerReport);
                      const errorObj = isFormValid(props.schedulerReport);
                      setError(errorObj);
                    }
                  }}
                  label="Share Report with Users*"
                  isMulti
                  options={GenerateUserOptions(props.users)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={SetDefaulSelectedUserEmailList(props.users, props.schedulerReport?.assignReport?.communicationList?.emails)}
                />
              </React.Fragment>
            ) : null}
            {props.schedulerReport.assignReport.channels.includes('Teams') ? (
              <React.Fragment>
                <p>Select Webhooks*</p>
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
                    props.setSchedulerReport(props.schedulerReport);
                    const errorObj = isFormValid(props.schedulerReport);
                    setError(errorObj);
                  }}
                  label="Select webhooks*"
                  isMulti
                  options={GenerateWebhookOptions(props.webHooks)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={SetDefaultWebHookList(props.webHooks, props.schedulerReport?.assignReport?.communicationList?.teams)}
                />
              </React.Fragment>
            ) : null}
            <TextArea
              value={props.schedulerReport?.report?.mailBody}
              label="Comments*"
              onChange={event => {
                props.schedulerReport.report.mailBody = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                setError(errorObj);
              }}
            />

            {props.thresholdAlert && <ThresholdAlert visual={props.visual} />}

            <TextField
              label="cron expression*"
              value={props.schedulerReport.schedule.cronExp}
              onChange={event => {
                props.schedulerReport.schedule.cronExp = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                setError(errorObj);
              }}
            />
            <DatePicker
              label="Start Date*"
              value={stringToDate(props.schedulerReport?.schedule?.startDate || '')}
              onChange={event => {
                props.schedulerReport.schedule.startDate = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                setError(errorObj);
              }}
            />
            <DatePicker
              label="End Date*"
              value={stringToDate(props.schedulerReport?.schedule?.endDate || '')}
              onChange={event => {
                props.schedulerReport.schedule.endDate = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                setError(errorObj);
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
  updateSuccess: storeState.scheduler.updateSuccess,
  scheduleReportresponse: storeState.scheduler.scheduleReportresponse,
  webHooks: storeState.notification.webHooks,
  view: storeState.views.entity,
  account: storeState.authentication.account,
  filters: storeState.filter.selectedFilters,
  features: storeState.feature.entities,
  selectedFilters: storeState.filter.selectedFilters,
  condition: storeState.scheduler.condition,
  timeConditions: storeState.scheduler.timeConditions,
  updating: storeState.scheduler.updating,
});

const mapDispatchToProps = {
  executeNow,
  getUsers,
  scheduleReport,
  getWebhookList,
  setSchedulerReport,
  getScheduleReportById,
  cancelScheduleReport,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
