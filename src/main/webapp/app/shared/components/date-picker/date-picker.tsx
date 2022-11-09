import { TextField } from '@mui/material';
import React from 'react';
import uuid from 'react-uuid';

interface IDatePickerProps {
  value: any;
  onChange: (date) => void;
  label?: string;
}
const DatePicker: React.FC<IDatePickerProps> = props => {
  return (
    <>
      <TextField
        type="date"
        id={uuid()}
        label={props.label}
        value={props.value}
        onChange={event => {
          props.onChange(event.target.value);
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </>
  );
};

export default DatePicker;
