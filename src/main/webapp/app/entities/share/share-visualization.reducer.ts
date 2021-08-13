export const ACTION_TYPES = {
  SET_IS_SHARE_LINK_PAGE: 'shareLinkPage/SET_IS_SHARE_LINK_PAGE',
};

const initialState = {
  isShareLinkPage: false,
};

export type shareLinkVisualizationState = Readonly<typeof initialState>;

export default (state: shareLinkVisualizationState = initialState, action): shareLinkVisualizationState => {
  switch (action.type) {
    case ACTION_TYPES.SET_IS_SHARE_LINK_PAGE:
      return {
        ...state,
        isShareLinkPage: action.payload,
      };
    default:
      return state;
  }
};

export const setIsShare = (isShareLinkPage: boolean) => ({
  type: ACTION_TYPES.SET_IS_SHARE_LINK_PAGE,
  payload: isShareLinkPage,
});
