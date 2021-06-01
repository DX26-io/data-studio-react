import { IPayload } from 'react-jhipster/src/type/redux-action.type';

/**
 * This is a special get type as views are dependent on dashboards
 */
export type ICrudGetViewFeaturesAction<T> = (viewId: string | number) => IPayload<T> | ((dispatch: any) => IPayload<T>);
