import React, { ReactText, useEffect, useState } from 'react';
import { Checkbox, CheckboxGroup, Form, TextField, View, TextArea, Flex, ButtonGroup, Button } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { SCHEDULER_CHANNELS } from 'app/shared/util/Scheduler.constants';
import { getUsers, scheduleReport, getScheduleReportById, executeNow } from 'app/modules/canvas/scheduler/scheduler.reducer';
import Select from 'react-select';
import DatePicker from 'app/shared/components/date-picker/date-picker';
import { stringToDate } from '../data-constraints/utils/date-util';
import { IEmail, ISchedule } from 'app/shared/model/schedule.model';
import { Translate } from 'react-jhipster';
import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { buildQueryDTO } from '../visualization/util/visualization-render-utils';
import { getWebhookList } from 'app/modules/canvas/scheduler/notification.reducer';
export interface ISchedulerProps extends StateProps, DispatchProps {
  visual: IVisualMetadataSet;
}
export interface IDropdown {
  label: string;
  value: string;
}

const Scheduler = (props: ISchedulerProps) => {
  const [channelsList, setChannels] = useState([]);
  const [reportTitle, setReportTitle] = useState('');
  const [comments, setComments] = useState('');
  const [cronExpression, setCronExpression] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [userList, setUserList] = useState<IDropdown[]>();
  const [webHookList, setWebHookList] = useState<IDropdown[]>();
  const [selectedUserEmail, setSelectedUserEmail] = useState<IEmail[]>();
  const [SelectedWebHooks, setSelectedWebHook] = useState<number[]>();
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
    props.getScheduleReportById(props.visual?.id);
    resetSelectedChannels();
  }, []);

  useEffect(() => {
    props.visual?.id && props.getScheduleReportById(props.visual?.id);
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

  useEffect(() => {
    if (props.scheduler?.report) {
      setReportTitle(props.scheduler?.report?.title_name);
      setComments(props.scheduler?.report?.mail_body);
      setSelectedChannel(props.scheduler?.assign_report?.channel);

      setStartDate(props.scheduler?.constraints?.start_date);
      setEndDate(props.scheduler?.constraints?.endDate);
      ;
      setSelectedWebHook(props.scheduler?.assign_report?.communication_list?.teams);
      setCronExpression(props.scheduler?.constraints?.cron_exp);
    }
  }, [props.scheduler]);

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
      emails.push({ user_name: actionMeta.option.value.split(' ')[0], user_email: actionMeta.option.value.split(' ')[1] });
      setSelectedUserEmail(emails);
    } else if (actionMeta.action === 'remove-value') {
      const filterEmails = emails.filter(element => {
        if (element.user_name !== actionMeta.removedValue.value.split(' ')[0]) {
          return element;
        }
      });
      setSelectedUserEmail(filterEmails);
    }
  };

  const handleChangeTeam = (value, actionMeta) => {
    const teams = SelectedWebHooks || [];
    if (actionMeta.action === 'select-option') {
      teams.push(actionMeta.option.value);
      setSelectedWebHook(teams);
    } else if (actionMeta.action === 'remove-value') {
      const postion = teams.indexOf(actionMeta.removedValue.value);
      teams.splice(postion, 1);
      setSelectedWebHook(teams);
    }
  };

  const setDimentionsAndMeasures = fields => {
    const dimension = [];
    const measure = [];
    fields.filter(function (item) {
      if (item.feature.featureType === 'DIMENSION') {
        dimension.push(item.feature.name);
      } else if (item.feature.featureType === 'MEASURE') {
        measure.push(item.feature.name);
      }
    });
    return {
      dimension,
      measure,
    };
  };

  const executeReport = () => {
    props.executeNow(props.visual.id);
  };

  const setReportChannels = item => {
    const channelsObj = selectedChannel || [];
    if (channelsObj.indexOf(item.key) === -1) {
      channelsObj.push(item.key);
    } else {
      channelsObj.splice(channelsObj.indexOf(item.key), 1);
    }
    setSelectedChannel(channelsObj);
    const list = channelsList;
    list.forEach(element => {
      if (element.key === item.key) {
        item.value = !element.value;
      }
    });
    setChannels(list);
  };

  const saveScheduleReport = () => {
    const dimentionsAndMeasures = setDimentionsAndMeasures(props.visual.fields);
    const scheduleReportObj = {
      datasourceid: props.view.viewDashboard.dashboardDatasource.id,
      dashboardId: props.view.viewDashboard.id.toString(),
      report: {
        userid: '',
        connection_name: '',
        report_name: reportTitle,
        source_id: 0,
        subject: '',
        title_name: reportTitle,
        mail_body: comments,
        dashboard_name: props.view.viewDashboard.dashboardName,
        view_name: props.view.viewName,
        view_id: props.view.id,
        share_link: 'share_link',
        build_url: 'build_url',
        thresholdAlert: false,
      },
      report_line_item: {
        visualizationid: props.visual.id,
        visualization: '',
        dimension: dimentionsAndMeasures.dimension,
        measure: dimentionsAndMeasures.measure,
      },
      queryDTO: buildQueryDTO(props.visual,props.filters),
      assign_report: {
        channel: selectedChannel,
        communication_list: { email: selectedUserEmail, teams: SelectedWebHooks },
      },
      schedule: {
        cron_exp: cronExpression,
        timezone: '',
        start_date: startDate,
        end_date: endDate,
      },
      constraints: '{}',
      putcall: false,
      emailReporter: false,
    };
    props.scheduleReport(scheduleReportObj);
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
                {props.scheduler?.report && (
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
              defaultValue={selectedUserEmail}
            />
            <p>Select Webhooks </p>
            <Select
              onChange={handleChangeTeam}
              label="Share Report with Users"
              isMulti
              options={webHookList}
              className="basic-multi-select"
              classNamePrefix="select"
              value={SelectedWebHooks}
              defaultValue={SelectedWebHooks}
            />

            <TextArea value={comments} onChange={setComments} label="Comments" />
            <TextField label="cron expression" value={cronExpression} onChange={setCronExpression} />
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
  scheduler: storeState.scheduler.scheduler,
  webHooks: storeState.notification.webHooks,
  view: storeState.views.entity,
  account: storeState.authentication.account,
  filters: storeState.filter.paramObject,
});

const mapDispatchToProps = { executeNow, getUsers, scheduleReport, getWebhookList, getScheduleReportById };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
