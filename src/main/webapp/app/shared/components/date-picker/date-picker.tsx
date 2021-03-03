import { TextField } from '@material-ui/core';
import React from 'react';
import uuid from 'react-uuid';

interface IDatePickerProps {
  value: any;
  onChange: (date) => void;
  label?: string;
}
const DatePicker: React.FC<IDatePickerProps> = props => {
  const dateChange = date => {
    props.onChange(date);
  };
  return (
    <>
      <TextField
        type="date"
        id={uuid()}
        label={props.label}
        value={props.value}
        defaultValue={props.value}
        onChange={event => {
          dateChange(event.target.value);
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </>
  );
};

export default DatePicker;
