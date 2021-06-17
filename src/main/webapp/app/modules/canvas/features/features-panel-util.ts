import { translate } from 'react-jhipster';

interface ITabData {
  id: number;
  name: string;
}

export const featureTypeToActiveTabs = ['DIMENSION', 'MEASURE', 'HIERARCHY'];

export const getFeaturesTabTranslations = (): ITabData[] => {
  return [
    {
      id: 0,
      name: translate('features.tabs.dimensions'),
    },
    {
      id: 1,
      name: translate('features.tabs.measures'),
    },
    {
      id: 2,
      name: translate('features.tabs.hierarchy'),
    },
  ];
};
