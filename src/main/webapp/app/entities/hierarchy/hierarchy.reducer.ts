import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IHierarchy, defaultValue } from 'app/shared/model/hierarchy.model';

export const ACTION_TYPES = {
  FETCH_HIERARCHY: 'hierarchy/FETCH_HIERARCHY',
  RESET: 'hierarchy/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  hierarchies: [] as ReadonlyArray<IHierarchy>,
  fetchedHierarchy: false,
  hierarchy: defaultValue,
};

export type HierarchyState = Readonly<typeof initialState>;

// Reducer
export default (state: HierarchyState = initialState, action): HierarchyState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_HIERARCHY):
      return {
        ...state,
        errorMessage: null,
        loading: true,
        fetchedHierarchy: false,
      };
    case FAILURE(ACTION_TYPES.FETCH_HIERARCHY):
      return {
        ...state,
        errorMessage: null,
        loading: false,
        fetchedHierarchy: false,
      };
    case SUCCESS(ACTION_TYPES.FETCH_HIERARCHY):
      return {
        ...state,
        errorMessage: null,
        loading: false,
        hierarchies: action.payload.data,
        fetchedHierarchy: true,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/hierarchies';

export const getHierarchies: ICrudGetAllAction<IHierarchy> = (datasource: number) => {
  const requestUrl = `${apiUrl}?datasource=${datasource}`;
  return {
    type: ACTION_TYPES.FETCH_HIERARCHY,
    payload: axios.get<IHierarchy>(requestUrl),
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
