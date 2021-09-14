import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IHierarchy, defaultValue } from 'app/shared/model/hierarchy.model';
import { IDrilldown } from 'app/shared/model/drilldown.model';

const addDrilldownIntoList = (hierarchy: IHierarchy) => {
  if (hierarchy.drilldown.length < 5) {
    hierarchy.drilldown.push({
      feature: null,
      order: hierarchy.drilldown.length,
    });
  }
  return hierarchy;
};

const removeDrilldownFromList = (hierarchy: IHierarchy, drilldown: IDrilldown) => {
  const index = hierarchy.drilldown.indexOf(drilldown);
  if (index > -1) {
    hierarchy.drilldown.splice(index, 1);
  }
  return hierarchy;
};

const sortDrillDowns = (hierarchy: IHierarchy) => {
  const _drilldown = hierarchy.drilldown.sort((a, b) => a.order - b.order);
  hierarchy['drilldown'] = _drilldown;
  return hierarchy;
};

export const ACTION_TYPES = {
  FETCH_HIERARCHY: 'hierarchies/FETCH_HIERARCHY',
  FETCH_HIERARCHIES: 'hierarchies/FETCH_HIERARCHIES',
  ADD_DRILLDOWN: 'hierarchies/ADD_DRILLDOWN',
  REMOVE_DRILLDOWN: 'hierarchies/REMOVE_DRILLDOWN',
  CREATE_HIERARCHY: 'hierarchies/CREATE_HIERARCHY',
  UPDATE_HIERARCHY: 'hierarchies/UPDATE_HIERARCHY',
  DELETE_HIERARCHY: 'hierarchies/DELETE_HIERARCHY',
  SET_HIERARCHY: 'hierarchies/SET_HIERARCHY',
  RESET: 'hierarchies/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  hierarchies: [] as ReadonlyArray<IHierarchy>,
  fetchedHierarchy: false,
  hierarchy: defaultValue,
  updateSuccess: false,
  updating: false,
};

export type HierarchyState = Readonly<typeof initialState>;

// Reducer
export default (state: HierarchyState = initialState, action): HierarchyState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_HIERARCHIES):
      return {
        ...state,
        errorMessage: null,
        loading: true,
        fetchedHierarchy: false,
      };
    case REQUEST(ACTION_TYPES.CREATE_HIERARCHY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case REQUEST(ACTION_TYPES.UPDATE_HIERARCHY):
    case REQUEST(ACTION_TYPES.DELETE_HIERARCHY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_HIERARCHIES):
      return {
        ...state,
        errorMessage: null,
        loading: false,
        fetchedHierarchy: false,
      };
    case FAILURE(ACTION_TYPES.CREATE_HIERARCHY):
      return {
        ...state,
        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_HIERARCHY):
    case FAILURE(ACTION_TYPES.DELETE_HIERARCHY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_HIERARCHIES):
      return {
        ...state,
        errorMessage: null,
        loading: false,
        hierarchies: action.payload.data,
        fetchedHierarchy: true,
      };
    case SUCCESS(ACTION_TYPES.CREATE_HIERARCHY):
      return {
        ...state,
        updateSuccess: true,
        errorMessage: null,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_HIERARCHY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        hierarchy: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_HIERARCHY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        hierarchy: defaultValue,
      };
    case ACTION_TYPES.ADD_DRILLDOWN:
      return {
        ...state,
        hierarchy: addDrilldownIntoList(state.hierarchy),
      };
    case ACTION_TYPES.REMOVE_DRILLDOWN:
      return {
        ...state,
        hierarchy: removeDrilldownFromList(state.hierarchy, action.payload),
      };
    case ACTION_TYPES.SET_HIERARCHY:
      return {
        ...state,
        hierarchy: sortDrillDowns(action.payload),
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        hierarchy: defaultValue,
        errorMessage: null,
        updateSuccess: false,
      };

    default:
      return state;
  }
};

const apiUrl = 'api/hierarchies';

export const getHierarchies: ICrudGetAllAction<IHierarchy> = (datasource: number) => {
  const requestUrl = `${apiUrl}?datasource=${datasource}`;
  return {
    type: ACTION_TYPES.FETCH_HIERARCHIES,
    payload: axios.get<IHierarchy>(requestUrl),
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const addDrilldown = () => ({
  type: ACTION_TYPES.ADD_DRILLDOWN,
});

export const removeDrilldown = (drilldown: IDrilldown) => ({
  type: ACTION_TYPES.REMOVE_DRILLDOWN,
  payload: drilldown,
});

export const setHierarchy = (hierarchy: IHierarchy) => ({
  type: ACTION_TYPES.SET_HIERARCHY,
  payload: hierarchy,
});

// export const sortDrillDowns = (hierarchy: IHierarchy) => ({
//   type: ACTION_TYPES.SORT_DRILLDOWNS,
//   payload: hierarchy,
// });

// TODO : created dummy..not tested
export const getHierarchy: ICrudGetAction<IHierarchy> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_HIERARCHY,
    payload: axios.get<IHierarchy>(requestUrl),
  };
};

export const createHierarchy: ICrudPutAction<IHierarchy> = hierarchy => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_HIERARCHY,
    payload: axios.post(apiUrl, hierarchy),
  });
  return result;
};

export const updateHierarchy: ICrudPutAction<IHierarchy> = hierarchy => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_HIERARCHY,
    payload: axios.put(apiUrl, hierarchy),
  });
  return result;
};

export const deleteHierarchy: ICrudDeleteAction<IHierarchy> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_HIERARCHY,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const generateHierarchiesOptions = hierarchies => {
  const options = [];
  hierarchies &&
    hierarchies.forEach(item => {
      options.push({ value: item.id, label: item.name });
    });
  return options;
};
