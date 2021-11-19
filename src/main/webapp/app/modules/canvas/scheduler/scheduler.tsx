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
  scheduleReport,
  getScheduleReportById,
  executeNow,
  setSchedulerReport,
  cancelScheduleReport,
  reset,
  setTimeCompatibleDimensions,
  setErrorMessage,
} from 'app/modules/canvas/scheduler/scheduler.reducer';
import Select from 'react-select';
import DatePicker from 'app/shared/components/date-picker/date-picker';
import { stringToDate } from '../data-constraints/utils/date-util';
import { Translate, translate } from 'react-jhipster';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { getWebhookList } from 'app/modules/canvas/scheduler/notification.reducer';
import {
  generateUserOptions,
  generateWebhookOptions,
  getHavingDTO,
  setDefaulSelectedUserEmailList,
  setDefaultWebHookList,
  assignTimeConditionsToScheduledObj,
  getReportTitle,
  getReportName,
  isFormValid,
  buildQueryDTO,
  getSchedulerConditionExpression,
  getTimeCompatibleDimensions,
} from './scheduler.util';
import ThresholdAlert from './threshold-alert';
import { toast } from 'react-toastify';
import {
  getShareLinkUrl,
  getBuildUrl,
} from 'app/modules/canvas/visualisation/visualisation-modal/visualisation-edit-modal/visualisation-edit-modal-util';
import Alert from '@spectrum-icons/workflow/Alert';
import { buildQueryDTO as buildQueryDTOFromVizRender } from '../visualisation/util/visualisation-render-utils';
import { getUsers } from 'app/modules/administration/user-management/users/user.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ISchedulerProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
  thresholdAlert: boolean;
}

const Scheduler = (props: ISchedulerProps) => {
  const [schedulerId, setSchedlerId] = useState(props.thresholdAlert ? 'threshold_alert_:' + props.visual?.id : props.visual?.id);

  useEffect(() => {
    props.getUsers(0, ITEMS_PER_PAGE, 'email,asc');
    props.getWebhookList();
    props.getScheduleReportById(schedulerId);
    props.setTimeCompatibleDimensions(getTimeCompatibleDimensions(props.features));
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
    props.executeNow(schedulerId);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      props.reset();
      props.setErrorMessage({
        translationKey: '',
        isValid: true,
      });
    }
  }, [props.updateSuccess]);

  const saveScheduleReport = () => {
    const dimentionsAndMeasures = setDimentionsAndMeasures(props.visual.fields);
    let queryDTO = null;
    if (props.thresholdAlert) {
      queryDTO = buildQueryDTO(props.visual, props.filters, props.timeConditions);
      queryDTO['having'] = getHavingDTO(props.visual, props.condition, props.selectedFilters, props.timeConditions);
      queryDTO['conditionExpression'] = getSchedulerConditionExpression(
        props.visual,
        props.condition,
        props.selectedFilters,
        props.timeConditions
      );
    } else {
      queryDTO = buildQueryDTOFromVizRender(props.visual, props.filters);
    }
    props.scheduleReport({
      ...props.schedulerReport,
      report: {
        dashboardName: props.view.viewDashboard.dashboardName,
        viewName: props.view.viewName,
        viewId: props.view.id,
        shareLink: getShareLinkUrl(props.view, props.visual.id),
        buildUrl: getBuildUrl(props.view.viewDashboard.id, props.view.id),
        thresholdAlert: props.thresholdAlert,
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
      constraints: assignTimeConditionsToScheduledObj(props.timeConditions, props.thresholdAlert),
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
            <Flex gap="size-100">
              {(!props.errorMessage?.isValid || props.scheduleReportresponse?.message) && (
                <React.Fragment>
                  <Alert color="Informative" />
                  <Text>
                    <span className="spectrum-Body-emphasis">
                      {props.errorMessage?.isValid ? (
                        props.scheduleReportresponse?.message
                      ) : (
                        <Translate contentKey={props.errorMessage?.translationKey}></Translate>
                      )}
                    </span>
                  </Text>
                </React.Fragment>
              )}
            </Flex>
            <Flex>
              <View>
                <ButtonGroup>
                  <Button
                    isDisabled={props.updating}
                    variant="negative"
                    onPress={() => {
                      props.cancelScheduleReport(schedulerId);
                    }}
                  >
                    <Translate contentKey="entity.action.cancel">Cancel</Translate>
                  </Button>
                  <Button onPress={saveScheduleReport} variant="cta" isDisabled={props.updating || !props.errorMessage?.isValid}>
                    <Translate contentKey="entity.action.save">Create</Translate>
                  </Button>
                  {schedulerId && (
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
              label={translate('reportsManagement.reports.form.reportName')}
              placeholder="Report Name"
              onChange={event => {
                props.schedulerReport.report.reportName = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                props.setErrorMessage(errorObj);
              }}
            />
            <CheckboxGroup
              label={translate('reportsManagement.reports.form.channels')}
              orientation="horizontal"
              value={props.schedulerReport?.assignReport?.channels}
              onChange={event => {
                props.schedulerReport.assignReport.channels = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                props.setErrorMessage(errorObj);
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
                <p>{translate('reportsManagement.reports.form.emails')}</p>
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
                    }
                    props.setSchedulerReport(props.schedulerReport);
                    const errorObj = isFormValid(props.schedulerReport);
                    props.setErrorMessage(errorObj);
                  }}
                  label={translate('reportsManagement.reports.form.emails')}
                  isMulti
                  options={generateUserOptions(props.users)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={setDefaulSelectedUserEmailList(props.users, props.schedulerReport?.assignReport?.communicationList?.emails)}
                />
              </React.Fragment>
            ) : null}
            {props.schedulerReport.assignReport.channels.includes('Teams') ? (
              <React.Fragment>
                <p>{translate('reportsManagement.reports.form.teams')}</p>
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
                    props.setErrorMessage(errorObj);
                  }}
                  label={translate('reportsManagement.reports.form.teams')}
                  isMulti
                  options={generateWebhookOptions(props.webHooks)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={setDefaultWebHookList(props.webHooks, props.schedulerReport?.assignReport?.communicationList?.teams)}
                />
              </React.Fragment>
            ) : null}
            <TextArea
              value={props.schedulerReport?.report?.mailBody}
              label={translate('reportsManagement.reports.form.comments')}
              onChange={event => {
                props.schedulerReport.report.mailBody = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                props.setErrorMessage(errorObj);
              }}
            />

            {props.thresholdAlert && <ThresholdAlert visual={props.visual} />}

            <TextField
              label={translate('reportsManagement.reports.form.cronExp')}
              value={props.schedulerReport.schedule.cronExp}
              onChange={event => {
                props.schedulerReport.schedule.cronExp = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                props.setErrorMessage(errorObj);
              }}
            />
            <DatePicker
              label={translate('reportsManagement.reports.form.startDate')}
              value={stringToDate(props.schedulerReport?.schedule?.startDate || '')}
              onChange={event => {
                props.schedulerReport.schedule.startDate = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                props.setErrorMessage(errorObj);
              }}
            />
            <DatePicker
              label={translate('reportsManagement.reports.form.endDate')}
              value={stringToDate(props.schedulerReport?.schedule?.endDate || '')}
              onChange={event => {
                props.schedulerReport.schedule.endDate = event;
                props.setSchedulerReport(props.schedulerReport);
                const errorObj = isFormValid(props.schedulerReport);
                props.setErrorMessage(errorObj);
              }}
            />
          </Form>
        </View>
      </Flex>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
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
  errorMessage: storeState.scheduler.errorMessage,
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
  setTimeCompatibleDimensions,
  setErrorMessage,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
