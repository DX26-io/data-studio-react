import React from 'react';
import { Translate } from 'react-jhipster';

interface IValidationErrorProps {
  contentKey: string;
}

const ValidationError: React.FC<IValidationErrorProps> = ({ contentKey }) => {
  return (
    <p className="spectrum-Body-emphasis error-message">
      <Translate contentKey={contentKey}></Translate>
    </p>
  );
};

export default ValidationError;
