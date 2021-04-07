import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { generateOptions } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IUserGroup, defaultValue } from 'app/shared/model/user-group.model';

export const ACTION_TYPES = {
  SET_IS_HOME: 'home/SET_IS_HOME',
};

const initialState = {
  isHome: false,
};

export type HomeState = Readonly<typeof initialState>;

// Reducer
export default (state: HomeState = initialState, action): HomeState => {
  switch (action.type) {
    case ACTION_TYPES.SET_IS_HOME:
      return {
        ...state,
        isHome: action.payload,
      };
    default:
      return state;
  }
};

export const setIsHome = (isHome: boolean) => ({
  type: ACTION_TYPES.SET_IS_HOME,
  payload: isHome,
});
