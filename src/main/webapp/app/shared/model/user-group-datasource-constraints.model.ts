import { IUserGroupFeatureConstraint, defaultValue as userGroupFeatureConstraintDefaultValue } from './user-group-feature-constraint.model';
import { IDatasources, defaultDatasourceValue } from './datasources.model';

export interface IUserGroupConstraintDefinition {
  featureConstraints: Array<IUserGroupFeatureConstraint>;
}

export const constraintDefinitionDefaultValue: Readonly<IUserGroupConstraintDefinition> = {
  featureConstraints: [userGroupFeatureConstraintDefaultValue],
};

export interface IUserGroupDatasourceConstraints {
  id?: any;
  constraintDefinition: any;
  userGroupName: string;
  datasourceId?: number;
  datasource?: IDatasources;
}

export const defaultValue: Readonly<IUserGroupDatasourceConstraints> = {
  id: '',
  constraintDefinition: constraintDefinitionDefaultValue,
  userGroupName: '',
  datasourceId: 0,
  datasource: defaultDatasourceValue,
};
