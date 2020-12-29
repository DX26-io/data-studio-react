import { translate } from 'react-jhipster';

interface ITabData {
  id: string;
  name: string;
}

interface IBorderData {
  value: string;
  name: string;
}

/**
 * This method returns the list of properies tab
 */
export const getPropertiesTabTranslations = (): ITabData[] => {
  return [
    {
      id: 'chartProperties',
      name: translate('views.editConfiguration.properties.chartProperties'),
    },
    {
      id: 'dataProperties',
      name: translate('views.editConfiguration.properties.dataProperties'),
    },
    {
      id: 'hierarchy',
      name: translate('views.editConfiguration.properties.hierarchy'),
    },
  ];
};
/**
 * This method returns the list of border type
 */
export const getSettingsTabTranslations = (): ITabData[] => {
  return [
    {
      id: 'query',
      name: translate('views.editConfiguration.settings.query'),
    },
    {
      id: 'dataConstraints',
      name: translate('views.editConfiguration.settings.dataConstraints'),
    },
    {
      id: 'thresholdAlert',
      name: translate('views.editConfiguration.settings.thresholdAlert'),
    },
    {
      id: 'data',
      name: translate('views.editConfiguration.settings.data'),
    },
  ];
};

/**
 * This method returns the list of settings tab
 */
export const getBorderList = (): IBorderData[] => {
  return [
    {
      value: 'Dotted',
      name: 'Dotted',
    },
    {
      value: 'Dashed',
      name: 'Dashed',
    },
    {
      value: 'Solid',
      name: 'Solid',
    },
    {
      value: 'Double',
      name: 'Double',
    },
    {
      value: 'Groove',
      name: 'Groove',
    },
    {
      value: 'Ridge',
      name: 'Ridge',
    },
    {
      value: 'Inset',
      name: 'Inset',
    },
    {
      value: 'Outset',
      name: 'Outset',
    },
    {
      value: 'None',
      name: 'None',
    },
    {
      value: 'Hidden',
      name: 'Hidden',
    },
  ];
};
