import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IFeatureCriteria, defaultValue } from 'app/shared/model/feature-critreria.model';

export const ACTION_TYPES = {
  FETCH_FEATURE_CRITERIA: 'featureCriteria/FETCH_FEATURE_CRITERIA',
  RESET: 'featureCriteria/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  featureCriteria: [] as ReadonlyArray<IFeatureCriteria>,
  fetchedFeatureCriteria: false,
};

export type FeatureCriteriaState = Readonly<typeof initialState>;

// Reducer
export default (state: FeatureCriteriaState = initialState, action): FeatureCriteriaState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_FEATURE_CRITERIA):
      return {
        ...state,
        errorMessage: null,
        loading: true,
        fetchedFeatureCriteria: false,
      };
    case FAILURE(ACTION_TYPES.FETCH_FEATURE_CRITERIA):
      return {
        ...state,
        errorMessage: null,
        loading: false,
        fetchedFeatureCriteria: false,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FEATURE_CRITERIA):
      return {
        ...state,
        errorMessage: null,
        loading: false,
        featureCriteria: action.payload.data,
        fetchedFeatureCriteria: true,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/feature-criteria';

export const getFeatureCriteria: ICrudGetAllAction<IFeatureCriteria> = (bookmarkId: number) => {
  const requestUrl = `${apiUrl}?featureBookmark=${bookmarkId}`;
  return {
    type: ACTION_TYPES.FETCH_FEATURE_CRITERIA,
    payload: axios.get<IFeatureCriteria>(requestUrl),
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
