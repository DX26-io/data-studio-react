import { Content, Picker, Section, Text, TextField, View } from '@adobe/react-spectrum';
import { Item, Tabs } from '@react-spectrum/tabs';
import React, { FC, ReactText, useEffect, useRef, useState } from 'react';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
} from 'app/modules/canvas/data-constraints/utils/date-util';
import DatePicker from 'app/shared/components/date-picker/date-picker';
import { DYNAMIC_DATE_RANGE_CONFIG, tabList } from 'app/shared/util/data-constraints.constants';

interface IDateRangeComponentProps {
  onDateChange: (fromDate, toDate, metadata) => void;
  condition?: any;
}

const DateRangeComponent = (props: IDateRangeComponentProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [customDynamicDateRange, setCustomDynamicDateRange] = useState('0');
  const [dateRangeTab, setDateRangeTab] = useState<ReactText>('0');
  const [isdynamicDateRangeConfig, setDynamicDateRangeConfig] = useState<ReactText>('');
  const [isCustom, setCustom] = useState(false);

  const TAB_DAY = '0';
  const TAB_RANGE = '1';
  const TAB_DYNAMIC = '2';
  let currentDynamicDateRangeConfig;
  const dynamicDateRangeConfig = DYNAMIC_DATE_RANGE_CONFIG;

  const onInputChange = () => {
    let _startDate;
    let _endDate;
    let startDateFormatted = '';
    let endDateFormatted = '';
    if (dateRangeTab === TAB_DAY) {
      startDateFormatted = _startDate = formatDate(resetTimezone(startOfDay(strToDate(startDate))));
      endDateFormatted = _endDate = formatDate(resetTimezone(endOfDay(strToDate(startDate))));
    } else if (dateRangeTab === TAB_RANGE) {
      startDateFormatted = _startDate = formatDate(resetTimezone(startOfDay(strToDate(startDate))));
      endDateFormatted = _endDate = formatDate(resetTimezone(endOfDay(strToDate(endDate))));
    } else if (dateRangeTab === TAB_DYNAMIC) {
      const startDateRange = getStartDateRange(currentDynamicDateRangeConfig);
      if (startDateRange) {
        _startDate = formatDate(resetTimezone(strToDate(startDateRange)));
        startDateFormatted = _startDate;
      } else {
        const startDateRangeInterval = getStartDateRangeInterval(currentDynamicDateRangeConfig, customDynamicDateRange);
        if (!startDateRangeInterval) {
          return;
        }
        const timeUnit = getStartDateRangeTimeUnit(currentDynamicDateRangeConfig) || '';
        _startDate = '__FLAIR_INTERVAL_OPERATION(NOW(' + timeUnit + "), '-', '" + startDateRangeInterval + "')";
        const adjustedDate = adjustStartDateRangeInterval(currentDynamicDateRangeConfig);
        startDateFormatted = formatDate(resetTimezone(startOfDay(adjustedDate)));
      }
      endDateFormatted = formatDate(resetTimezone(endOfDay(strToDate(new Date()))));
      _endDate = '__FLAIR_NOW()';
    }
    props.onDateChange(_startDate, _endDate, {
      startDateFormatted,
      endDateFormatted,
      tab: dateRangeTab,
      currentDynamicDateRangeConfig,
      customDynamicDateRange,
    });
  };

  const handleStartDateChange = date => {
    setStartDate(date);
    onInputChange();
  };
  const handleEndDateChange = date => {
    setEndDate(date);
    onInputChange();
  };

  useEffect(() => {
    if (props.condition) {
      setDateRangeTab(props.condition?.metadata?.tab.toString());
      setStartDate(new Date(props.condition?.valueType?.value));
      setEndDate(new Date(props.condition?.secondValueType?.value));
      if (props.condition?.metadata?.tab === TAB_DYNAMIC) {
        setCustomDynamicDateRange(props.condition?.metadata?.customDynamicDateRange);
        setDynamicDateRangeConfig(props.condition?.metadata?.currentDynamicDateRangeConfig?.title);
      }
    }
  }, []);

  useEffect(() => {
    if (dateRangeTab === TAB_DYNAMIC) {
      currentDynamicDateRangeConfig = dynamicDateRangeConfig.find(d => d.title === isdynamicDateRangeConfig);
      if (currentDynamicDateRangeConfig?.isCustom) {
        setCustom(true);
      } else {
        setCustom(false);
      }
      onInputChange();
    }
  }, [isdynamicDateRangeConfig, customDynamicDateRange]);

  return (
    <>
      <div className={'date-range-picker-tab'}>
        <Tabs onSelectionChange={key => setDateRangeTab(key)} isQuiet={true} density={'compact'}>
          <Item title="Day" key="0">
            <Content marginStart="size-125">
              <View marginTop={5}>
                <DatePicker label="Day" onChange={handleStartDateChange} value={stringToDate(startDate)} />
              </View>
            </Content>
          </Item>
          <Item title="Range" key="1">
            <Content marginStart="size-125">
              <View marginTop={5}>
                <DatePicker label="Start Date" onChange={handleStartDateChange} value={stringToDate(startDate)} />
              </View>
              <View marginTop={5}>
                <DatePicker label="End Date" onChange={handleEndDateChange} value={stringToDate(endDate)} />
              </View>
            </Content>
          </Item>
          <Item title="Dynamic" key="2">
            <Content marginStart="size-125">
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
            </Content>
          </Item>
        </Tabs>
      </div>
    </>
  );
};

export default DateRangeComponent;
