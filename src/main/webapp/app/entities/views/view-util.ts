import { IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';
import { translate } from 'react-jhipster';
import { IPayload, IPayloadResult } from 'react-jhipster/src/type/redux-action.type';
import { IViews } from 'app/shared/model/views.model';

/**
 * This is a special delete type as views are dependent on dashboards
 */
export type ICrudViewDeleteAction<T> = (viewId: string | number, dashboardId: string | number) => IPayload<T> | IPayloadResult<T>;

/**
 * This is a special get type as views are dependent on dashboards
 */
export type ICrudGetDashboardViewsAction<T> = (
  dashboardId: string | number,
  page?: number,
  size?: number,
  sort?: string
) => IPayload<T> | ((dispatch: any) => IPayload<T>);

/**
 * This is a special type for store all data type
 */
export type ISaveViewState<T> = (visualmetaDataDTO: IViewStateDTO) => IPayload<T> | ((dispatch: any) => IPayload<T>);

export interface IViewStateDTO {
  visualMetadataSet: IVisualMetadataSet[];
  _id: number;
  viewFeatureCriterias: {
    features: [];
    viewId: number;
  };
}

export const generateViewNameOptions = (views) => {
  const options = [];
  views &&
    views.forEach(item => {
      options.push({ value: item.id, label: item.viewName });
    });
  return options;
};

