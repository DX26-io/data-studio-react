import { IPayload } from 'react-jhipster/src/type/redux-action.type';
import { IError, defaultValue } from 'app/shared/model/error.model';
import { IFeature } from 'app/shared/model/feature.model';

/**
 * This is a special get type as views are dependent on dashboards
 */
export type ICrudGetViewFeaturesAction<T> = (viewId: string | number) => IPayload<T> | ((dispatch: any) => IPayload<T>);

const isEmpty = (name: string) => {
  return name !== '';
};

const isValidLength = (name: string) => {
  return name.length > 40;
};

export const isFormValid = (feature: IFeature): IError => {
  let error = defaultValue;
  if (!isEmpty(feature.name)) {
    error = { translationKey: 'features.error.name', isValid: false };
  } else if (isValidLength(feature.name)) {
    error = { translationKey: 'features.error.nameLength', isValid: false };
  } else if (!isEmpty(feature.type)) {
    error = { translationKey: 'features.error.type', isValid: false };
  } else if (isValidLength(feature.type)) {
    error = { translationKey: 'features.error.typeLength', isValid: false };
  } else if (!isEmpty(feature.definition)) {
    error = { translationKey: 'features.error.definition', isValid: false };
  }
  return error;
};

export const generateAlternativeDimensionsOptions = data => {
  const options = [];
  if (data) {
    const _data = JSON.parse(data);
    _data.forEach(function (option) {
      options.push({ value: option['featureId'], label: option['featureName'] });
    });
  }
  return options;
};

export const generateFeaturesOptions = data => {
  const options = [];
  if (data) {
    data.forEach(function (option) {
      options.push({ value: option['id'], label: option['name'] });
    });
  }
  return options;
};
