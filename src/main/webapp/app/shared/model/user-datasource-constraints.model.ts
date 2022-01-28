import { IUser, defaultValue as user } from './user.model';
import { IDatasources, defaultDatasourceValue as datasource } from './datasources.model';
import { IUserFeatureConstraint, defaultValue as featureConstraintDefaultValue } from './user-feature-constraint.model';

// IUserConstraintDefinition is the part of datasource constraints so it ok to write in a same file
export interface IUserConstraintDefinition {
  featureConstraints: Array<IUserFeatureConstraint>;
}

export const constraintDefinitionDefaultValue: Readonly<IUserConstraintDefinition> = {
  featureConstraints: [featureConstraintDefaultValue],
};

export interface IUserDatasourceConstraints {
  id?: any;
  // TODO : constraintDefinition interface is throwing error. need replace with any with IUserConstraintDefinition
  constraintDefinition: any;
  user: IUser;
  datasource: IDatasources;
}

export const defaultValue: Readonly<IUserDatasourceConstraints> = {
  id: '',
  constraintDefinition: constraintDefinitionDefaultValue,
  user,
  datasource,
};
