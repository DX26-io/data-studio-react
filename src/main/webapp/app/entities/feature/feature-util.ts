import { IPayload } from 'react-jhipster/src/type/redux-action.type';
import { IError, defaultValue } from 'app/shared/model/error.model';
import { IFeature } from 'app/shared/model/feature.model';
import { translate } from 'react-jhipster';

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

export const generateFeaturesOptions = features => {
  const options = [];
  features.forEach(option => {
    options.push({ value: option.id, label: option.name });
  });
  return options;
};

export const generateOptions = features => {
  const options = [];
  features.forEach(option => {
    options.push({ value: option.name, label: option.name });
  });
  return options;
};

export const getFeature = (featureList: readonly IFeature[], feature: string) => {
  return featureList.find(item => item.name === feature);
};

export const onSetDatesInFeature = (featureList, featureName, startDate, endDate, metadata) => {
  const index = featureList.findIndex(feature => feature.name === featureName);
  featureList[index].selected = startDate;
  featureList[index].selected2 = endDate;
  featureList[index].metadata = metadata;
  return Object.assign([], featureList);
};

export const updatePinnedFeaturesState = (features, url) => {
  const params = new URLSearchParams(url);
  const id = url.split('id=')[1].split('&')[0];
  const pin = params.get('pin');
  const foundIndex = features.findIndex(f => f.id === Number(id));
  features[foundIndex].pin = pin === 'true';
  return Object.assign([], features);
};

export const updateFavoriteFeaturesState = (features, url) => {
  const params = new URLSearchParams(url);
  const id = url.split('id=')[1].split('&')[0];
  const favouriteFilter = params.get('favouriteFilter');
  const foundIndex = features.findIndex(f => f.id === Number(id));
  features[foundIndex].favouriteFilter = favouriteFilter==='true';
  return Object.assign([], features);
};
