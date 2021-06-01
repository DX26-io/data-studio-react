import { IVisualMetadataSet } from 'app/shared/model/visual-meta-data.model';
import { translate } from 'react-jhipster';
import { IPayload, IPayloadResult } from 'react-jhipster/src/type/redux-action.type';

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
}
