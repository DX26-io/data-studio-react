import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IEmailConfig, defaultValue as emailDefaultValue } from 'app/shared/model/email-config.model';

export const ACTION_TYPES = {
  FETCH_CHANNEL_PARAMETERS: 'reports-configuration/FETCH_CHANNEL_PARAMETERS',
  FETCH_EMAIL_CONFIG: 'reports-configuration/FETCH_EMAIL_CONFIG',
  CREATE_EMAIL_CONFIG: 'reports-configuration/CREATE_EMAIL_CONFIG',
  SET_EMAIL_CONFIG: 'reports-configuration/SET_EMAIL_CONFIG',
  UPDATE_EMAIL_CONFIG: 'reports-configuration/UPDATE_EMAIL_CONFIG',
  FETCH_TEAM_CONFIG: 'reports-configuration/FETCH_TEAM_CONFIG',
  FETCH_JIRA_CONFIG: 'reports-configuration/FETCH_JIRA_CONFIG',
  DELETE_CHANNEL_CONFIG: 'reports-configuration/DELETE_CHANNEL_CONFIG',
};

const initialState = {
  loading: false,
  errorMessage: null,
  channelParameters: [],
  channelParametersFetched: false,
  updateSuccess: false,
  emailConfig: emailDefaultValue,
  updating: false,
};

export type ReportConfigurationState = Readonly<typeof initialState>;

export default (state: ReportConfigurationState = initialState, action): ReportConfigurationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CHANNEL_PARAMETERS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
        channelParametersFetched: false,
      };
    case FAILURE(ACTION_TYPES.FETCH_CHANNEL_PARAMETERS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        channelParametersFetched: false,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CHANNEL_PARAMETERS):
      return {
        ...state,
        loading: false,
        channelParameters: action.payload.data.channelParameters,
        channelParametersFetched: true,
      };
    case REQUEST(ACTION_TYPES.FETCH_EMAIL_CONFIG):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_EMAIL_CONFIG):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_EMAIL_CONFIG):
      return {
        ...state,
        loading: false,
        emailConfig: action.payload.data,
        updateSuccess: false,
      };
    case REQUEST(ACTION_TYPES.CREATE_EMAIL_CONFIG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.CREATE_EMAIL_CONFIG):
      return {
        ...state,

        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.CREATE_EMAIL_CONFIG):
      return {
        ...state,
        emailConfig: action.payload.data,
        updateSuccess: true,
        updating: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_CHANNEL_CONFIG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.DELETE_CHANNEL_CONFIG):
      return {
        ...state,
        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CHANNEL_CONFIG):
      return {
        ...state,
        emailConfig: emailDefaultValue,
        updateSuccess: true,
        updating: false,
      };
    case ACTION_TYPES.SET_EMAIL_CONFIG:
      return {
        ...state,
        emailConfig: action.payload,
      };

    default:
      return state;
  }
};

const apiUrl = 'api/notification';

export const fetchChannelParameters = (channel: string) => ({
  type: ACTION_TYPES.FETCH_CHANNEL_PARAMETERS,
  payload: axios.get(`${apiUrl}/channelParameters/?channel=${channel}`),
});

export const fetchEmailConfig = (id: number) => ({
  type: ACTION_TYPES.FETCH_EMAIL_CONFIG,
  payload: axios.get(`${apiUrl}/getEmailConfig/?id=${id}`),
});

export const createEmailConfig = (emailConfig: IEmailConfig) => ({
  type: ACTION_TYPES.CREATE_EMAIL_CONFIG,
  payload: axios.post(`${apiUrl}/createEmailConfig`, emailConfig),
});

export const setEmailConfig = (emailConfig: IEmailConfig) => ({
  type: ACTION_TYPES.SET_EMAIL_CONFIG,
  payload: emailConfig,
});

export const fetchTeamConfig = (id: number) => ({
  type: ACTION_TYPES.FETCH_TEAM_CONFIG,
  payload: axios.get(`${apiUrl}/getTeamConfig/?id=${id}`),
});

export const fetchJiraConfig = (id: number) => ({
  type: ACTION_TYPES.FETCH_JIRA_CONFIG,
  payload: axios.get(`${apiUrl}/getJiraConfig/?id=${id}`),
});

export const deleteChannelConfig = (id: number) => ({
  type: ACTION_TYPES.DELETE_CHANNEL_CONFIG,
  payload: axios.delete(`${apiUrl}/deleteChannelConfig/?id=${id}`),
});
