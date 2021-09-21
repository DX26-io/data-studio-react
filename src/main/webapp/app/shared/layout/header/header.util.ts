import { IDashboard } from 'app/shared/model/dashboard.model';
import { IFeature } from 'app/shared/model/feature.model';
import { IViews } from 'app/shared/model/views.model';

export const generateDashboardNameOptions = (dashboards: Array<IDashboard>) => {
  const options = [];
  dashboards &&
    dashboards.forEach(item => {
      options.push({ value: item.id, label: item.dashboardName });
    });
  return options;
};

export const generateViewNameOptions = (views: Array<IViews>) => {
  const options = [];
  views &&
    views.forEach(item => {
      options.push({ value: item.id, label: item.viewName });
    });
  return options;
};

export const getFeature = (featureList: readonly IFeature[], feature: string) => {
  return featureList.find(item => item.name === feature);
};
