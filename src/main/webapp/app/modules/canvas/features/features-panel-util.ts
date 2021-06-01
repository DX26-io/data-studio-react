import { translate } from 'react-jhipster';

interface ITabData {
  id: number;
  name: string;
}

export const featureTypeToActiveTabs = ['DIMENSION', 'MEASURE'];

export const getFeaturesTabTranslations = (): ITabData[] => {
  return [
    {
      id: 0,
      name: translate('views.features.tabs.dimensions'),
    },
    {
      id: 1,
      name: translate('views.features.tabs.measures'),
    },
  ];
};
