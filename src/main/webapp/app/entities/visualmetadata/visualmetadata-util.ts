import { IViews } from 'app/shared/model/views.model';
import { AxiosPromise } from 'axios';
import { IPayload, IPayloadResult } from 'react-jhipster';

export declare type ICrudPutActionVisual<T> = (data?: T, view?: IViews, filter?: any) => IPayload<T> | IPayloadResult<T>;
