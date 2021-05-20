export interface IFeatureConstraint {
  '@type': string;
  featureName: string;
  values: Array<any>;
}

export const defaultValue: Readonly<IFeatureConstraint> = {
  '@type': '',
  featureName: '',
  values: [],
};
