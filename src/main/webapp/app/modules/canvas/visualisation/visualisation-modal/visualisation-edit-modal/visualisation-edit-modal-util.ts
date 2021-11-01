import { IViews } from 'app/shared/model/views.model';
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
      name: translate('views.editConfiguration.properties.chartProperties.title'),
    },
    {
      id: 'dataProperties',
      name: translate('views.editConfiguration.properties.dataProperties.title'),
    },
    // {
    //   id: 'hierarchy',
    //   name: translate('views.editConfiguration.properties.hierarchy'),
    // },
  ];
};

/**
 * This method returns the list of properies tab
 */
export const getChartPropertiesTranslations = (): ITabData[] => {
  return [
    {
      id: 'titleProperties',
      name: translate('views.editConfiguration.properties.chartProperties.titleProperties'),
    },
    {
      id: 'bodyProperties',
      name: translate('views.editConfiguration.properties.chartProperties.bodyProperties'),
    },
    {
      id: 'chartCongifuration',
      name: translate('views.editConfiguration.properties.chartProperties.chartConfiguration'),
    },
  ];
};

/**
 * This method returns the list of data properies tab
 */
export const getDataPropertiesTabTranslations = (): ITabData[] => {
  return [
    {
      id: 'DIMENSION',
      name: translate('views.editConfiguration.properties.dataProperties.dimensions'),
    },
    {
      id: 'MEASURE',
      name: translate('views.editConfiguration.properties.dataProperties.measures'),
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
      id: 'scheduler',
      name: translate('views.editConfiguration.settings.scheduler'),
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

export const getShareLinkUrl = (view: IViews, visualisationId: string) => {
  return `${location.host}/dashboards/share?dashboardName=${view.viewDashboard.dashboardName}&viewName=${view.viewName}&dashboarID=${view.viewDashboard.id}&viewId=${view.id}&datasourceId=${view.viewDashboard.dashboardDatasource.id}&visualisationId=${visualisationId}`;
};
