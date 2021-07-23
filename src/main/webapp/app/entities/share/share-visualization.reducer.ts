export const ACTION_TYPES = {
  SET_IS_SHARE: 'share/SET_IS_SHARE',
  SET_SEARCHED_TEXT: 'home/SET_SEARCHED_TEXT',
};

const initialState = {
  isShare: false,
  searchedText: '',
};

export type ShareVisualizationState = Readonly<typeof initialState>;

export default (state: ShareVisualizationState = initialState, action): ShareVisualizationState => {
  switch (action.type) {
    case ACTION_TYPES.SET_IS_SHARE:
      return {
        ...state,
        isShare: action.payload,
      };
    case ACTION_TYPES.SET_SEARCHED_TEXT:
      return {
        ...state,
        searchedText: action.payload,
      };
    default:
      return state;
  }
};

export const setIsShare = (isShare: boolean) => ({
  type: ACTION_TYPES.SET_IS_SHARE,
  payload: isShare,
});

export const updateSearchedText = (searchedText: string) => ({
  type: ACTION_TYPES.SET_SEARCHED_TEXT,
  payload: searchedText,
});
