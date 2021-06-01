import React from 'react';
import { Picker, Item } from '@adobe/react-spectrum';
import { Translate, translate } from 'react-jhipster';
import { SEPARATORS } from 'app/config/constants';

interface ISeparatorsProps {
  setSeparator: (id: string) => void;
}

const Separators: React.FC<ISeparatorsProps> = ({ setSeparator }) => {

  const [_separator, _setSeparator] = React.useState(SEPARATORS[0].id);


  return (
    <Picker
      placeholder={translate('separators.placeholder')}
      items={SEPARATORS}
      onSelectionChange={event => {
        setSeparator(String(event));
        _setSeparator(String(event));
      }}
    >
      {item => (
        <Item>
          {item.name}
          {/* TODO : translate does not work here. items get disaligned */}
          {/* <Translate contentKey={item.name}> {item.name}</Translate> */}
        </Item>
      )}
    </Picker>
  );
};

export default Separators;
