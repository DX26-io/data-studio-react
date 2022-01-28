export interface IUserGroupFeatureConstraint {
  '@type': string;
  id: string;
}

export const defaultValue: Readonly<IUserGroupFeatureConstraint> = {
  '@type': 'Feature',
  id: '',
};
