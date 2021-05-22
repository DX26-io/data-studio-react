import React, { useState, useEffect } from 'react';
import { TextField } from '@adobe/react-spectrum';
import { translate } from 'react-jhipster';
import { SEPARATORS } from 'app/config/constants';

interface ISeparatorInputProps {
  values: Array<any>;
  dispatchCommaSeparatedValues: (commaSeparatedValues: string) => void;
  separator: string;
}

const SeparatorInput: React.FC<ISeparatorInputProps> = ({ separator, dispatchCommaSeparatedValues, values }) => {
  const [_commaSeparatedValues, _setCommaSeparatedValues] = useState('');

  const generateCommaSeparatedValues = () => {
    return values
      .map(elem => {
        return elem;
      })
      .join(separator ? separator : SEPARATORS[0].id);
  };

  useEffect(() => {
    _setCommaSeparatedValues(generateCommaSeparatedValues());
  }, []);

  return (
    <TextField
      placeholder={translate('separators.inputPlaceholder')}
      onBlur={() => {
        dispatchCommaSeparatedValues(_commaSeparatedValues);
      }}
      value={_commaSeparatedValues}
      onChange={event => {
        _setCommaSeparatedValues(event);
      }}
    />
  );
};

export default SeparatorInput;
