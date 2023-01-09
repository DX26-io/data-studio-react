import { Content, Picker, Section, Text, TextField, View, TabList, Item, TabPanels, Tabs } from '@adobe/react-spectrum';
import React, { FC, ReactText, useEffect, useRef, useState } from 'react';
import {
  formatDate,
  resetTimezone,
  startOfDay,
  strToDate,
  endOfDay,
  getStartDateRange,
  getStartDateRangeInterval,
  getStartDateRangeTimeUnit,
  adjustStartDateRangeInterval,
  stringToDate,
} from 'app/shared/util/date-utils';
import DatePicker from 'app/shared/components/date-picker/date-picker';
import { DYNAMIC_DATE_RANGE_CONFIG, tabList } from 'app/shared/util/data-constraints.constants';
import { translate, Translate } from 'react-jhipster';

interface IDateRangeComponentProps {
  onDateChange: (fromDate, toDate, metadata) => void;
  condition?: any;
  startDate?: any;
  endDate?: any;
  metadata?: any;
}

const DateRangeComponent = (props: IDateRangeComponentProps) => {

  const [tabId, setTabId] = useState<ReactText>('0');
  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);
  const [customDynamicDateRange, setCustomDynamicDateRange] = useState('0');
  const [isdynamicDateRangeConfig, setDynamicDateRangeConfig] = useState<ReactText>('');
  const [isCustom, setCustom] = useState(false);
  const TAB_DAY = '0';
  const TAB_RANGE = '1';
  const TAB_DYNAMIC = '2';
  let currentDynamicDateRangeConfig;
  const dynamicDateRangeConfig = DYNAMIC_DATE_RANGE_CONFIG;

  const onInputChange = (_startDate, _endDate) => {
    let fromDate;
    let toDate;
    let startDateFormatted = '';
    let endDateFormatted = '';
    if (tabId === TAB_DAY) {
      startDateFormatted = fromDate = formatDate(resetTimezone(startOfDay(strToDate(_startDate))));
      endDateFormatted = toDate = formatDate(resetTimezone(endOfDay(strToDate(_startDate))));
    } else if (tabId === TAB_RANGE) {
      startDateFormatted = fromDate = formatDate(resetTimezone(startOfDay(strToDate(_startDate))));
      endDateFormatted = toDate = formatDate(resetTimezone(endOfDay(strToDate(_endDate))));
    } else if (tabId === TAB_DYNAMIC) {
      const startDateRange = getStartDateRange(currentDynamicDateRangeConfig);
      if (startDateRange) {
        fromDate = formatDate(resetTimezone(strToDate(startDateRange)));
        startDateFormatted = fromDate;
      } else {
        const startDateRangeInterval = getStartDateRangeInterval(currentDynamicDateRangeConfig, customDynamicDateRange);
        if (!startDateRangeInterval) {
          return;
        }
        const timeUnit = getStartDateRangeTimeUnit(currentDynamicDateRangeConfig) || '';
        fromDate = '__FLAIR_INTERVAL_OPERATION(NOW(' + timeUnit + "), '-', '" + startDateRangeInterval + "')";
        const adjustedDate = adjustStartDateRangeInterval(currentDynamicDateRangeConfig);
        startDateFormatted = formatDate(resetTimezone(startOfDay(adjustedDate)));
      }
      endDateFormatted = formatDate(resetTimezone(endOfDay(strToDate(new Date()))));
      toDate = '__FLAIR_NOW()';
    }
    props.onDateChange(fromDate, toDate, {
      startDateFormatted,
      endDateFormatted,
      tab: tabId,
      currentDynamicDateRangeConfig,
      customDynamicDateRange,
    });
  };

  const handleStartDateChange = date => {
    setStartDate(new Date(date));
    onInputChange(new Date(date), new Date());
  };
  const handleEndDateChange = date => {
    setEndDate(new Date(date));
    onInputChange(new Date(), new Date(date));
  };

  useEffect(() => {
    if (props.condition) {
      if (props.condition?.metadata?.tab.toString()) {
        setTabId(props.condition?.metadata?.tab.toString());
      }
      if (props.condition?.valueType?.value) {
        setStartDate(new Date(props.condition?.valueType?.value));
      }
      if (props.condition?.secondValueType?.value) {
        setEndDate(new Date(props.condition?.secondValueType?.value));
      }
      if (props.condition?.metadata?.tab === TAB_DYNAMIC) {
        setCustomDynamicDateRange(props.condition?.metadata?.customDynamicDateRange);
        setDynamicDateRangeConfig(props.condition?.metadata?.currentDynamicDateRangeConfig?.title);
      }
    }
  }, []);

  useEffect(() => {
    if (tabId === TAB_DYNAMIC) {
      currentDynamicDateRangeConfig = dynamicDateRangeConfig.find(d => d.title === isdynamicDateRangeConfig);
      if (currentDynamicDateRangeConfig?.isCustom) {
        setCustom(true);
      } else {
        setCustom(false);
      }
      onInputChange(startDate, endDate);
    }
  }, [isdynamicDateRangeConfig, customDynamicDateRange]);

  useEffect(() => {
    setStartDate(props.startDate);
    setEndDate(props.endDate);
    if (props.metadata?.tab) setTabId(props.metadata?.tab.toString());
    if (props.metadata?.tab === TAB_DYNAMIC) {
      if (props.metadata?.customDynamicDateRange) setCustomDynamicDateRange(props.metadata?.customDynamicDateRange);
      if (props.metadata?.currentDynamicDateRangeConfig?.title)
        setDynamicDateRangeConfig(props.metadata?.currentDynamicDateRangeConfig?.title);
    }
  }, [props.startDate, props.endDate, props.metadata]);

  return (
    <>
      <div className={'date-range-picker-tab'}>
        <Tabs aria-label="date-range" selectedKey={tabId} onSelectionChange={setTabId} isQuiet={true} density={'compact'}>
          <TabList>
            <Item key={'0'}>
              <Translate contentKey="dateRange.tabs.day"></Translate>
            </Item>
            <Item key={'1'}>
              <Translate contentKey="dateRange.tabs.range"></Translate>
            </Item>
            <Item key={'2'}>
              <Translate contentKey="dateRange.tabs.dynamic"></Translate>
            </Item>
          </TabList>
          <TabPanels>
            <Item key={0}>
              <Content marginStart="size-125">
                <View marginTop={5}>
                  <DatePicker label={translate('dateRange.tabs.day')} onChange={handleStartDateChange} value={stringToDate(startDate)} />
                </View>
              </Content>
            </Item>
            <Item key={1}>
              <Content marginStart="size-125">
                <React.Fragment>
                  {' '}
                  <View marginTop={5}>
                    <DatePicker label={translate('dateRange.startDate')} onChange={handleStartDateChange} value={stringToDate(startDate)} />
                  </View>
                  <View marginTop={5}>
                    <DatePicker label={translate('dateRange.endDate')} onChange={handleEndDateChange} value={stringToDate(endDate)} />
                  </View>{' '}
                </React.Fragment>
              </Content>
            </Item>
            <Item key={2}>
              <Content marginStart="size-125">
                <React.Fragment>
                  <View marginTop={5}>
                    <Picker
                      selectedKey={isdynamicDateRangeConfig}
                      items={dynamicDateRangeConfig}
                      onSelectionChange={selected => setDynamicDateRangeConfig(selected)}
                    >
                      {item => <Item key={item.title}>{item.title}</Item>}
                    </Picker>
                  </View>
                  <View marginTop={5}>{isCustom && <TextField value={customDynamicDateRange} onChange={setCustomDynamicDateRange} />}</View>
                </React.Fragment>
              </Content>
            </Item>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
};

export default DateRangeComponent;
