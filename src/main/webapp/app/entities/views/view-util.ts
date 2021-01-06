import { IVisualMetadataSet } from 'app/shared/model/visualMetadata.model';
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
export type ISaveViewState<T> = (visualmetaDataDTO: ISaveViewStateDTO) => IPayload<T> | ((dispatch: any) => IPayload<T>);

export interface ISaveViewStateDTO {
  visualMetadataSet: IVisualMetadataSet[];
  _id: number;
}

/**
 * This method returns an object that contains view form labels
 */
export const getViewFromTranslations = (): any => {
  return {
    VIEW_LABEL: translate('views.viewName'),
    DESCRIPTION_LABEL: translate('views.description'),
  };
};

/**
 * This method returns an object that contains dashboard success translations
 */
export const getViewSuccessTranslations = (): any => {
  return {
    SUCCESS_LABEL: translate('views.created.header'),
    SUCCESS_CLOSE_LABEL: translate('entity.action.cancel'),
    PRIMARY_ACTION_LABEL: translate('entity.action.open'),
  };
};

/**
 * This method returns an object that contains dashboard error translations
 */
export const getViewErrorTranslations = (): any => {
  return {
    ERROR_LABEL: translate('views.error.header'),
    ERROR_CLOSE_LABEL: translate('entity.action.cancel'),
  };
};
