import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IOrganisation } from 'app/shared/model/organisation.model';
import { ICrudSearchAction } from 'react-jhipster/src/type/redux-action.type';
import { translate } from 'react-jhipster';

export const ACTION_TYPES = {
  FETCH_ORGANISATIONS: 'organisation/FETCH_ORGANISATIONS',
  FETCH_ORGANISATION: 'organisation/FETCH_ORGANISATION',
  CREATE_ORGANISATION: 'organisation/CREATE_ORGANISATION',
  UPDATE_ORGANISATION: 'organisation/UPDATE_ORGANISATION',
  DELETE_ORGANISATION: 'organisation/DELETE_ORGANISATION',
  SET_ORGANISATION: 'organisation/SET_ORGANISATION',
  UPDATE_ORGANISATION_NAME: 'organisation/UPDATE_ORGANISATION_NAME',
  RESET: 'organisation/RESET',
  UPDATE_ORGANISATION_STATUS: 'realms/UPDATE_ORGANISATION_STATUS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  organisations: [] as ReadonlyArray<IOrganisation>,
  updating: false,
  updateSuccess: false,
  fetchSuccess: false,
  totalItems: 0,
  organisation: null,
};

export type OrganisationState = Readonly<typeof initialState>;

// Reducer
export default (state: OrganisationState = initialState, action): OrganisationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ORGANISATIONS):
    case REQUEST(ACTION_TYPES.FETCH_ORGANISATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_ORGANISATION):
    case REQUEST(ACTION_TYPES.UPDATE_ORGANISATION):
      return {
        ...state,
        updating: true,
        updateSuccess: false,
      };
    case REQUEST(ACTION_TYPES.UPDATE_ORGANISATION_NAME):
      return {
        ...state,
        updating: true,
        updateSuccess: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_ORGANISATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case REQUEST(ACTION_TYPES.UPDATE_ORGANISATION_STATUS):
      return {
        ...state,
        updating: true,
        updateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.FETCH_ORGANISATIONS):
    case FAILURE(ACTION_TYPES.FETCH_ORGANISATION):
    case FAILURE(ACTION_TYPES.CREATE_ORGANISATION):
    case FAILURE(ACTION_TYPES.UPDATE_ORGANISATION):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_ORGANISATION_NAME):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.DELETE_ORGANISATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.UPDATE_ORGANISATION_STATUS):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ORGANISATIONS):
      return {
        ...state,
        loading: false,
        organisations: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.CREATE_ORGANISATION):
      return {
        ...state,
        updateSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_ORGANISATION):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_ORGANISATION_STATUS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_ORGANISATION_NAME):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
      };
    case ACTION_TYPES.SET_ORGANISATION:
      return {
        ...state,
        organisation: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        fetchSuccess: false,
        updateSuccess: false,
        updating: false,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/organisation';

export const updateName = orgName => ({
  type: ACTION_TYPES.UPDATE_ORGANISATION_NAME,
  payload: axios.put(`${apiUrl}?name=${orgName}`),
});

export const getOrganisations: ICrudGetAllAction<IOrganisation> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ORGANISATIONS,
    payload: axios.get<IOrganisation>(requestUrl),
  };
};

export const searchOrganisations: ICrudSearchAction<IOrganisation> = (name: string, page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?name=${name}&page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ORGANISATIONS,
    payload: axios.get<IOrganisation>(requestUrl),
  };
};

export const updateStatus = (isActive, id) => ({
  type: ACTION_TYPES.UPDATE_ORGANISATION_STATUS,
  payload: axios.put(`${apiUrl}/update-status?isActive=${isActive}&id=${id}`),
});

export const setOrganisation = (organisation: IOrganisation) => ({
  type: ACTION_TYPES.SET_ORGANISATION,
  payload: organisation,
});
