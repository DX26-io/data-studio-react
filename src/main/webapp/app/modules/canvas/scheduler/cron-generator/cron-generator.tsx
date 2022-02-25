import React, { useState, ReactText } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Tabs } from '@react-spectrum/tabs';
import { Content, Item, View, Flex } from '@adobe/react-spectrum';
import { translate, Translate } from 'react-jhipster';
import { MINUTES, HOURS, MONTHS, DAYS, DAYS_OF_MONTH } from './cron-generator.const';
import { generateOptions } from 'app/shared/util/entity-utils';
import { generateCronExpression } from './cron-generator.util';
import { setSchedulerReport } from 'app/modules/canvas/scheduler/scheduler.reducer';

const CronGenerator = props => {
  const [error, onError] = useState();
  const [value, setValue] = useState();
  const [tabId, setTabId] = useState<ReactText>('1');
  const [minutes, setMinutes] = useState([]);
  const [hours, setHours] = useState([]);
  const [days, setDays] = useState([]);
  const [daysOfMonth, setDaysOfMonth] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [months, setMonths] = useState([]);

  const tabs = [
    { id: '1', name: 'reportsManagement.cron.minutes' },
    { id: '2', name: 'reportsManagement.cron.hourly' },
    { id: '3', name: 'reportsManagement.cron.daily' },
    { id: '4', name: 'reportsManagement.cron.weekly' },
    { id: '5', name: 'reportsManagement.cron.monthly' },
    { id: '6', name: 'reportsManagement.cron.yearly' },
  ];

  const convertSelectOptionToValues = options => {
    let _options = [];
    if (options && options.length > 0) {
      _options = options.map(m => m.value);
    }
    return _options;
  };

  return (
    <Tabs aria-label="roles" items={tabs} selectedKey={tabId} onSelectionChange={setTabId}>
      {item => (
        <Item title={translate(item.name)}>
          <Content marginTop="size-250" marginStart="size-125" marginEnd="size-125">
            {tabId === '1' && (
              <View width={'25%'}>
                <span className="spectrum-Body-emphasis--sizeXXS">
                  <Translate contentKey="reportsManagement.cron.minutes">Minutes*</Translate>
                </span>
                <View marginTop="size-100">
                  <Select
                    isMulti
                    searchable={true}
                    onBlurResetsInput={false}
                    onCloseResetsInput={false}
                    placeholder={translate('reportsManagement.cron.minutes')}
                    value={minutes}
                    onChange={event => {
                      setMinutes(event);
                      const cron = generateCronExpression(
                        tabId.toString(),
                        convertSelectOptionToValues(event),
                        convertSelectOptionToValues(hours),
                        convertSelectOptionToValues(daysOfMonth),
                        convertSelectOptionToValues(daysOfWeek),
                        convertSelectOptionToValues(months),
                        props.schedulerReport.schedule.cronExp
                      );
                      props.schedulerReport.schedule.cronExp = cron;
                      props.setSchedulerReport(props.schedulerReport);
                    }}
                    options={generateOptions(MINUTES)}
                  />
                </View>
              </View>
            )}
            {tabId === '2' && (
              <Flex direction="row" gap="size-150">
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.hours">Hours*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.hours')}
                      value={hours}
                      onChange={event => {
                        setHours(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(HOURS)}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.minutes">Minutes*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.minutes')}
                      value={minutes}
                      onChange={event => {
                        setMinutes(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(MINUTES)}
                    />
                  </View>
                </View>
              </Flex>
            )}
            {tabId === '3' && (
              <Flex direction="row" gap="size-150">
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.hours">Hours*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.hours')}
                      value={hours}
                      onChange={event => {
                        setHours(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(HOURS)}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.minutes">Minutes*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.minutes')}
                      value={minutes}
                      onChange={event => {
                        setMinutes(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(MINUTES)}
                    />
                  </View>
                </View>
              </Flex>
            )}
            {tabId === '4' && (
              <Flex direction="row" gap="size-150">
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.day_of_week">Day of Week*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.day_of_week')}
                      value={days}
                      onChange={event => {
                        setDays(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={DAYS}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.hours">Hours*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.hours')}
                      value={hours}
                      onChange={event => {
                        setHours(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(HOURS)}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.minutes">Minutes*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.minutes')}
                      value={minutes}
                      onChange={event => {
                        setMinutes(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(MINUTES)}
                    />
                  </View>
                </View>
              </Flex>
            )}{' '}
            {tabId === '6' && (
              <Flex direction="row" gap="size-150">
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.months">Months*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.months')}
                      value={months}
                      onChange={event => {
                        setMonths(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(event),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={MONTHS}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.day_of_month">Day of Month*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.day_of_month')}
                      value={daysOfMonth}
                      onChange={event => {
                        setDaysOfMonth(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(DAYS_OF_MONTH)}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.day_of_week">Day of Week*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.day_of_week')}
                      value={days}
                      onChange={event => {
                        setDays(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={DAYS}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.hours">Hours*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.hours')}
                      value={hours}
                      onChange={event => {
                        setHours(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(HOURS)}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.minutes">Minutes*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.minutes')}
                      value={minutes}
                      onChange={event => {
                        setMinutes(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(MINUTES)}
                    />
                  </View>
                </View>
              </Flex>
            )}
            {tabId === '5' && (
              <Flex direction="row" gap="size-150">
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.day_of_month">Day of Month*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.day_of_month')}
                      value={daysOfMonth}
                      onChange={event => {
                        setDaysOfMonth(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(DAYS_OF_MONTH)}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.day_of_week">Day of Week*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.day_of_week')}
                      value={days}
                      onChange={event => {
                        setDays(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={DAYS}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.hours">Hours*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.hours')}
                      value={hours}
                      onChange={event => {
                        setHours(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(minutes),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(HOURS)}
                    />
                  </View>
                </View>
                <View width={'25%'}>
                  <span className="spectrum-Body-emphasis--sizeXXS">
                    <Translate contentKey="reportsManagement.cron.minutes">Minutes*</Translate>
                  </span>
                  <View marginTop="size-100">
                    <Select
                      isMulti
                      placeholder={translate('reportsManagement.cron.minutes')}
                      value={minutes}
                      onChange={event => {
                        setMinutes(event);
                        const cron = generateCronExpression(
                          tabId.toString(),
                          convertSelectOptionToValues(event),
                          convertSelectOptionToValues(hours),
                          convertSelectOptionToValues(daysOfMonth),
                          convertSelectOptionToValues(daysOfWeek),
                          convertSelectOptionToValues(months),
                          props.schedulerReport.schedule.cronExp
                        );
                        props.schedulerReport.schedule.cronExp = cron;
                        props.setSchedulerReport(props.schedulerReport);
                      }}
                      options={generateOptions(MINUTES)}
                    />
                  </View>
                </View>
              </Flex>
            )}
          </Content>
        </Item>
      )}
    </Tabs>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  schedulerReport: storeState.scheduler.schedulerReport,
});

const mapDispatchToProps = {
  setSchedulerReport,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CronGenerator);
