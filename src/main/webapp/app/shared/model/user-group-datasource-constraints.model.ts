import { IUserGroupFeatureConstraint, defaultValue as userGroupFeatureConstraintDefaultValue } from './user-group-feature-constraint.model';
import { IDatasources, defaultDatasourceValue } from './datasources.model';
import { IUserGroup,defaultValue as defaultUserGroupValue } from './user-group.model';

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
  userGroup?:IUserGroup;
}

export const defaultValue: Readonly<IUserGroupDatasourceConstraints> = {
  id: '',
  constraintDefinition: constraintDefinitionDefaultValue,
  userGroupName: '',
  datasourceId: 0,
  datasource: defaultDatasourceValue,
  userGroup:defaultUserGroupValue
};
