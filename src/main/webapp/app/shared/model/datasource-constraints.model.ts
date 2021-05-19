import { IUser, defaultValue as user } from './user.model';
import { IDatasources, defaultDatasourceValue as datasource } from './datasources.model';
import { IFeatureConstraint, defaultValue as featureConstraintDefaultValue } from './feature-constraint.model';

// IConstraintDefinition is the part of datasource constraints so it ok to write in a same file
export interface IConstraintDefinition {
  featureConstraints: Array<IFeatureConstraint>;
}

export const constraintDefinitionDefaultValue: Readonly<IConstraintDefinition> = {
  featureConstraints: [featureConstraintDefaultValue],
};

export interface IDatasourceConstraints {
  id?: any;
  // TODO : constraintDefinition interface is throwing error. need replace with any with IConstraintDefinition
  constraintDefinition: any;
  user: IUser;
  datasource: IDatasources;
}

export const defaultValue: Readonly<IDatasourceConstraints> = {
  id: '',
  constraintDefinition: constraintDefinitionDefaultValue,
  user,
  datasource,
};
