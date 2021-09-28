import React, { ReactText, useEffect, useState } from 'react';
import { Checkbox, CheckboxGroup, Form, TextField, View, TextArea, Flex, ButtonGroup, Button } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { SCHEDULER_CHANNELS } from 'app/shared/util/Scheduler.constants';
import { getUsers, scheduleReport, getScheduleReportById, executeNow } from 'app/modules/canvas/scheduler/scheduler.reducer';
import Select from 'react-select';
import DatePicker from 'app/shared/components/date-picker/date-picker';
import { stringToDate } from '../data-constraints/utils/date-util';
import { Translate } from 'react-jhipster';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { buildQueryDTO } from '../visualization/util/visualization-render-utils';
import { getWebhookList } from 'app/modules/canvas/scheduler/notification.reducer';
import { IEmail } from 'app/shared/model/email.model';
import { schedulerReportDefaultValue } from 'app/shared/model/scheduler-report.model';
import { updateEmail, updateWebhook } from './scheduler.util';
export interface ISchedulerProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
}
export interface IDropdown {
  label: string;
  value: string;
}

const Scheduler = (props: ISchedulerProps) => {
  const todayDate = new Date();
  const [channelsList, setChannels] = useState([]);
  const [reportTitle, setReportTitle] = useState(props.visual?.titleProperties?.titleText);
  const [comments, setComments] = useState('');
  const [cronExp, setCronExpression] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(todayDate.setDate(todayDate.getDate() + 1)));
  const [userList, setUserList] = useState<IDropdown[]>();
  const [webHookList, setWebHookList] = useState<IDropdown[]>();
  const [selectedUserEmail, setSelectedUserEmail] = useState<IDropdown[]>();
  const [selectedWebHooks, setSelectedWebHook] = useState<number[]>();

  const [selectedChannel, setSelectedChannel] = useState<string[]>();
  const resetSelectedChannels = () => {
    const channels = [];
    Object.keys(SCHEDULER_CHANNELS).forEach(item => {
      channels.push({
        key: item,
        value: false,
      });
    });
    setChannels(channels);
  };
  useEffect(() => {
    props.getUsers();
    props.getWebhookList();
    props.getScheduleReportById(props.visual.id);
    resetSelectedChannels();
  }, []);

  useEffect(() => {
    props.visual.id && props.getScheduleReportById(props.visual.id);
  }, [props.visual]);

  useEffect(() => {
    if (props.users.length > 0) {
      const usersData = [];
      props.users.forEach(element => {
        usersData.push({ value: `${element.login} ${element.email}`, label: `${element.login} ${element.email}` });
      });
      setUserList(usersData);
    }
  }, [props.users]);

  const setDefaultWebHookList = (webhook) => {
    const list = [];
    webhook.forEach(element => {
      const data = webHookList?.find(x => parseInt(x.value) === element);
      if (data) {
        list.push(data)
      }
    });
    return list;
  }
  const setDefaulSelectedUserEmailList = (userEmails) => {
    const list = [];
    userEmails.forEach(element => {
      const data = userList?.find(x => x.value === `${element.userName} ${element.userEmail}`);
      if (data) {
        list.push(data)
      }
    });
    return list;
  }

  useEffect(() => {
    if (props.schedulerReport?.reportLineItem.visualizationId) {
      setReportTitle(props.schedulerReport?.report?.titleName);
      setComments(props.schedulerReport?.report?.mailBody);
      setSelectedChannel(props.schedulerReport?.assignReport?.channels);
      setStartDate(props.schedulerReport?.schedule?.startDate);
      setEndDate(props.schedulerReport?.schedule?.endDate);
      setSelectedWebHook(setDefaultWebHookList(props.schedulerReport?.assignReport?.communicationList?.teams));
      setSelectedUserEmail(setDefaulSelectedUserEmailList(props.schedulerReport?.assignReport?.communicationList?.emails))
      setCronExpression(props.schedulerReport?.schedule?.cronExp);
    }
  }, [props.schedulerReport]);

  useEffect(() => {
    if (props.webHooks.length > 0) {
      const webHookData = [];
      props.webHooks.forEach(element => {
        webHookData.push({ value: `${element.id}`, label: ` ${element.webhookName}` });
      });
      setWebHookList(webHookData);
    }
  }, [props.webHooks]);

  const handleStartDateChange = date => {
    setStartDate(date);
  };
  const handleEndDateChange = date => {
    setEndDate(date);
  };

  const handleChangeEmail = (value, actionMeta) => {
    const emails = selectedUserEmail || [];
    if (actionMeta.action === 'select-option') {
      emails.push({ label: actionMeta.option.value, value: actionMeta.option.value });
      setSelectedUserEmail(emails);
    } else if (actionMeta.action === 'remove-value') {
      const filterEmails = emails.filter(element => {
        if (element.value !== actionMeta.removedValue.value) {
          return element;
        }
      });
      setSelectedUserEmail(filterEmails);
    }
  };

  const handleChangeTeam = (value, actionMeta) => {
    const teams = selectedWebHooks || [];
    if (actionMeta.action === 'select-option') {
      teams.push(actionMeta.option);
      setSelectedWebHook(teams);
    } else if (actionMeta.action === 'remove-value') {
      const postion = teams.indexOf(actionMeta.removedValue.value);
      teams.splice(postion, 1);
      setSelectedWebHook(teams);
    }
  };

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

  const setReportChannels = item => {
    const channelsObj = [];
    const list = channelsList;
    list.forEach(element => {
      if (element.key === item.key) {
        item.value = !element.value;
      }
      if (element.value) {
        channelsObj.push(element.key);
      }
    });
    setChannels(list);
    setSelectedChannel(channelsObj);
  };

  const saveScheduleReport = () => {
    // TODO : this is not the best practice..will be refactored in near future
    const dimentionsAndMeasures = setDimentionsAndMeasures(props.visual.fields);

    props.scheduleReport({
      ...schedulerReportDefaultValue,
      datasourceId: props.view.viewDashboard.dashboardDatasource.id,
      dashboardId: props.view.viewDashboard.id.toString(),
      putCall: props.schedulerReport?.reportLineItem.visualizationId ? true : false,
      constraints: "{}",
      report: {
        userId: '',
        connectionName: '',
        reportName: reportTitle,
        sourceId: 0,
        subject: 'subject',
        titleName: reportTitle,
        mailBody: comments,
        dashboardName: props.view.viewDashboard.dashboardName,
        viewName: props.view.viewName,
        viewId: props.view.id,
        shareLink: 'shareLink',
        buildUrl: 'buildUrl',
        thresholdAlert: false,
      },
      reportLineItem: {
        visualizationId: props.visual.id,
        visualizationType: props.visual.metadataVisual.name,
        dimensions: dimentionsAndMeasures.dimensions,
        measures: dimentionsAndMeasures.measures,
      },
      assignReport: {
        channels: selectedChannel,
        communicationList: {
          emails: updateEmail(selectedUserEmail),
          teams: updateWebhook(selectedWebHooks),
        },
      },
      schedule: {
        cronExp,
        endDate,
        startDate,
        timezone: '',
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
                <Button variant="secondary">
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
                {props.schedulerReport?.reportLineItem.visualizationId && (
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
            <TextField value={reportTitle} onChange={setReportTitle} label="Report Name" placeholder="Report Name" />
            <CheckboxGroup value={selectedChannel} label="Channels" orientation="horizontal">
              {channelsList.map(item => {
                return (
                  <Checkbox
                    onChange={() => {
                      setReportChannels(item);
                    }}
                    defaultSelected={item.value}
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
              onChange={handleChangeEmail}
              label="Share Report with Users"
              isMulti
              options={userList}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedUserEmail}
            />
            <p>Select Webhooks </p>
            <Select
              onChange={handleChangeTeam}
              label="Share Report with Users"
              isMulti
              options={webHookList}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedWebHooks}
            />

            <TextArea value={comments} onChange={setComments} label="Comments" />
            <TextField label="cron expression" value={cronExp} onChange={setCronExpression} />
            <DatePicker label="Start Date" onChange={handleStartDateChange} value={stringToDate(startDate)} />
            <DatePicker label="End Date" onChange={handleEndDateChange} value={stringToDate(endDate)} />
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
});

const mapDispatchToProps = { executeNow, getUsers, scheduleReport, getWebhookList, getScheduleReportById };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
