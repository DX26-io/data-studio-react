import { VisualWrap } from 'app/modules/canvas/visualization/util/visualmetadata-wrapper';
import { IViews } from 'app/shared/model/views.model';
import { IVisualizations } from 'app/shared/model/visualizations.model';
import { Constraint } from 'app/shared/util/visualization.constants';
import { IVisualizationsListProps } from './visualizations-list';

export const createFields = (newVM: any) => {
  const order = 0;
  newVM.fields = newVM.metadataVisual.fieldTypes
    .filter(function (item) {
      return item.constraint === Constraint.Required;
    })
    .map(function (item) {
      return {
        fieldType: item,
        feature: null,
        constraint: item.constraint,
        properties: item.propertyTypes,
      };
    });
  newVM.fields.forEach(function (field) {
    field.order = order + 1;
    field.properties = field.fieldType.propertyTypes.map(function (item) {
      return {
        propertyType: item.propertyType,
        value: item.propertyType.defaultValue,
        type: item.propertyType.type,
        order: item.order,
      };
    });
  });

  return newVM;
};

export const createProperties = (newVM: any) => {
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

export const createVisualMetadata = (visualization: IVisualizations, view: IViews, totalItem: number) => {
  let newVM = {
    isCardRevealed: true,
    isSaved: false,
    viewId: view.id,
    titleProperties: {
      titleText: visualization.name,
      backgroundColor: '#fafafa',
      borderBottom: 'none',
      color: '#676a6c',
    },
    bodyProperties: {
      opacity: 1,
      backgroundColor: `var(--spectrum-alias-background-color-gray-50, var(--spectrum-global-color-gray-50, var(--spectrum-semantic-gray-50-color-background)))`,
      border: 'none',
    },
    visualBuildId: visualization.id + 'a' + Math.round(Math.random() * 1000000),
    width: 1,
    w: 1,
    xPosition: (totalItem * 2) % (3 || 12) || 0,
    x: (totalItem * 2) % (3 || 12) || 0,
    height: 3,
    h: 3,
    yPosition: 0,
    y: 0,
    metadataVisual: visualization,
    views: view,
    datasource: view.viewDashboard.dashboardDatasource.id,
  };
  newVM = createProperties(newVM);
  newVM = createFields(newVM);
  return VisualWrap(newVM);
};
