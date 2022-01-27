import { IUserGroupFeatureConstraint, defaultValue as userGroupFeatureConstraintDefaultValue } from './user-group-feature-constraint.model';

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
  datasourceId: number;
}

export const defaultValue: Readonly<IUserGroupDatasourceConstraints> = {
  id: '',
  constraintDefinition: constraintDefinitionDefaultValue,
  userGroupName: '',
  datasourceId:0
};
