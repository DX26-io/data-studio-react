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
    // {
    //   id: 'hierarchy',
    //   name: translate('views.editConfiguration.properties.hierarchy'),
    // },
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
      value: 'dotted',
      name: 'Dotted',
    },
    {
      value: 'dashed',
      name: 'Dashed',
    },
    {
      value: 'solid',
      name: 'Solid',
    },
    {
      value: 'double',
      name: 'Double',
    },
    {
      value: 'groove',
      name: 'Groove',
    },
    {
      value: 'ridge',
      name: 'Ridge',
    },
    {
      value: 'inset',
      name: 'Inset',
    },
    {
      value: 'outset',
      name: 'Outset',
    },
    {
      value: 'none',
      name: 'None',
    },
    {
      value: 'hidden',
      name: 'Hidden',
    },
  ];
};
