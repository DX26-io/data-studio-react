import React, { useState, useEffect } from 'react';
import { TextArea } from '@adobe/react-spectrum';
import { translate } from 'react-jhipster';

interface ISeparatorInputProps {
  values: Array<any>;
  dispatchSeparatedValues: (separatedValues: string) => void;
  separator: string;
}

const SeparatorInput: React.FC<ISeparatorInputProps> = ({ separator, dispatchSeparatedValues, values }) => {
  const [_separatedValues, _setSeparatedValues] = useState('');

  const generateSeparatedValues = () => {
    return (
      values &&
      values.length > 0 &&
      values
        .map(elem => {
          return elem;
        })
        .join(separator)
    );
  };

  useEffect(() => {
    _setSeparatedValues(generateSeparatedValues());
  }, []);

  return (
    <TextArea
      placeholder={translate('separators.inputPlaceholder')}
      onBlur={() => {
        dispatchSeparatedValues(_separatedValues);
      }}
      value={_separatedValues}
      onChange={event => {
        _setSeparatedValues(event);
      }}
    />
  );
};

export default SeparatorInput;
