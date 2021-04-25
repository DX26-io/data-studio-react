import axios from 'axios';

import { SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  GET_PROFILE: 'applicationProfile/GET_PROFILE',
  TOGGLE_EDIT_MODE: 'applicationProfile/TOGGLE_EDIT_MODE',
  TOGGLE_FILTER_PANEL: 'applicationProfile/TOGGLE_FILTER_PANEL',
  TOGGLE_FEATURES_PANEL: 'applicationProfile/TOGGLE_FEATURES_PANEL',
};

const initialState = {
  ribbonEnv: '',
  inProduction: true,
  isSwaggerEnabled: false,
  isEditMode: false,
  isFilterOpen: false,
  isFeaturesPanelOpen: false,
};

export type ApplicationProfileState = Readonly<typeof initialState>;

export default (state: ApplicationProfileState = initialState, action): ApplicationProfileState => {
  switch (action.type) {
    case SUCCESS(ACTION_TYPES.GET_PROFILE): {
      const { data } = action.payload;
      return {
        ...state,
        ribbonEnv: data['display-ribbon-on-profiles'],
        inProduction: data.activeProfiles.includes('prod'),
        isSwaggerEnabled: data.activeProfiles.includes('swagger'),
      };
    }
    case ACTION_TYPES.TOGGLE_EDIT_MODE:
      return {
        ...state,
        isEditMode: !state.isEditMode,
      };
    case ACTION_TYPES.TOGGLE_FILTER_PANEL:
      return {
        ...state,
        isFilterOpen: !state.isFilterOpen,
        isFeaturesPanelOpen: state.isFeaturesPanelOpen && !state.isFilterOpen,
      };
    case ACTION_TYPES.TOGGLE_FEATURES_PANEL:
      return {
        ...state,
        isFeaturesPanelOpen: !state.isFeaturesPanelOpen,
        isFilterOpen: state.isFilterOpen && !state.isFeaturesPanelOpen,
      };
    default:
      return state;
  }
};

export const getProfile = () => ({
  type: ACTION_TYPES.GET_PROFILE,
  payload: axios.get('management/info'),
});

export const toggleEditMode = () => ({
  type: ACTION_TYPES.TOGGLE_EDIT_MODE,
});

export const toggleFilterPanel = () => ({
  type: ACTION_TYPES.TOGGLE_FILTER_PANEL,
});

export const toggleFeaturesPanel: () => void = () => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.TOGGLE_FEATURES_PANEL,
  });
};
