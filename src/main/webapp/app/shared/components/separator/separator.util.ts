import { IUserDatasourceConstraints, defaultValue } from 'app/shared/model/user-datasource-constraints.model';
import { translate } from 'react-jhipster';

export const SEPARATORS = [
  {
    label: translate('separators.comma'),
    value: ',',
  },
  {
    label: translate('separators.space'),
    value: ' ',
  },
  {
    label: translate('separators.pipe'),
    value: '|',
  },
  {
    label: translate('separators.colon'),
    value: ':',
  },
];


export const addCommaSeparatedValuesIntoConstraint = (
  commaSeparatedValues: string,
  constraint: IUserDatasourceConstraints,
  condition: any,
  separator: string
) => {
  if (commaSeparatedValues && commaSeparatedValues.length > 0) {
    condition.isCommaSeparatedInputOn = false;
    const index = constraint.constraintDefinition.featureConstraints.indexOf(condition);
    if (index > -1) {
      constraint.constraintDefinition.featureConstraints[index].values = commaSeparatedValues.split(separator);
    }
  }
  return constraint;
};
