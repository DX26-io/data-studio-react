import React from 'react';
import { Picker, Item } from '@adobe/react-spectrum';
import { Translate, translate } from 'react-jhipster';
import { SEPARATORS } from './separator.util';
import Select from 'react-select';

interface ISeparatorsProps {
  setSeparator: (id: string) => void;
}

const Separators: React.FC<ISeparatorsProps> = ({ setSeparator }) => {
  const [_separator, _setSeparator] = React.useState(SEPARATORS[0]);

  return (
    <div style={{ minWidth: '300px' }}>
      <Select
        isSea
        placeholder={translate('separators.placeholder')}
        value={_separator}
        onChange={event => {
          _setSeparator(event);
          setSeparator(event.value);
        }}
        options={SEPARATORS}
      />
    </div>
  );
};

export default Separators;
