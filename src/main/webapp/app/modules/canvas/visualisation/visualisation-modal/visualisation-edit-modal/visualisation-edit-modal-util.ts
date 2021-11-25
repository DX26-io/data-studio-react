import { IViews } from 'app/shared/model/views.model';
import { translate } from 'react-jhipster';
import { VisualWrap } from '../../util/visualmetadata-wrapper';

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

export const getBuildUrl = (viewId: number, dashboardId: number) => {
  return `${location.host}/dashboards/build?dashboardId=${dashboardId}&viewId=${viewId}`;
};

export const createFields = newVM => {
  newVM.fields = newVM.metadataVisual.fieldTypes
    .filter(function (item) {
      return item.constraint === 'REQUIRED';
    })
    .map(function (item) {
      return {
        fieldType: item,
        feature: null,
        constraint: item.constraint,
      };
    });

  return newVM;
};

export const createProperties = newVM => {
  newVM.properties = newVM.metadataVisual.propertyTypes.map(function (item) {
    return {
      propertyType: item.propertyType,
      value: item.propertyType.defaultValue,
      order: item.order,
      type: item.propertyType.type,
    };
  });
  return newVM;
};

export const createVisualMetadata = (visualisation,view,totalItem) => {
  let newVM = {
    isCardRevealed: true,
    isSaved: false,
    viewId: view.id,
    titleProperties: {
      titleText: visualisation.name,
      backgroundColor: '#fafafa',
      borderBottom: 'none',
      color: '#676a6c',
    },
    bodyProperties: {
      opacity: 1,
      backgroundColor: `var(--spectrum-global-color-static-gray-50)`,
      border: 'none',
    },
    visualBuildId: visualisation.id + 'a' + Math.round(Math.random() * 1000000),
    width: 1,
    w: 1,
    xPosition: (totalItem * 2) % (3 || 12),
    x: (totalItem * 2) % (3 || 12),
    height: 3,
    h: 3,
    yPosition: 1000,
    y: 1000,
    metadataVisual: visualisation,
    views: view,
    datasource: view.viewDashboard.dashboardDatasource.id,
  };
  newVM = createProperties(newVM);
  newVM = createFields(newVM);
  return VisualWrap(newVM);
};
