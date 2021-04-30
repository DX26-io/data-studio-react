import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IFunction } from 'app/shared/model/function.model';

export const ACTION_TYPES = {
  FETCH_FUNCTIONS_LIST: 'feature/FETCH_FUNCTIONS_LIST',
};

const initialState = {
  errorMessage: null,
  entities: [] as ReadonlyArray<IFunction>,
};

export type FunctionState = Readonly<typeof initialState>;

// Reducer

export default (state: FunctionState = initialState, action): FunctionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_FUNCTIONS_LIST):
      return {
        ...state,
        errorMessage: null,
      };
    case FAILURE(ACTION_TYPES.FETCH_FUNCTIONS_LIST):
      return {
        ...state,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FUNCTIONS_LIST):
      return {
        ...state,
        entities: action.payload.data,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/functions';

// Actions

export const getEntities: ICrudGetAllAction<IFunction> = () => ({
  type: ACTION_TYPES.FETCH_FUNCTIONS_LIST,
  payload: axios.get<IFunction>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});
