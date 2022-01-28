export interface IUserFeatureConstraint {
  '@type': string;
  featureName: string;
  values: Array<any>;
}

export const defaultValue: Readonly<IUserFeatureConstraint> = {
  '@type': '',
  featureName: '',
  values: [],
};
