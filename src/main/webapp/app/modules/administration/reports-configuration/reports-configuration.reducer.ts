import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IEmailConfig, defaultValue as emailConfigDefaultValue } from 'app/shared/model/email-config.model';
import { ITeamConfig, defaultValue as teamConfigDefaultValue } from 'app/shared/model/team-config.model';

export const ACTION_TYPES = {
  FETCH_CHANNEL_PARAMETERS: 'reports-configuration/FETCH_CHANNEL_PARAMETERS',
  FETCH_EMAIL_CONFIG: 'reports-configuration/FETCH_EMAIL_CONFIG',
  CREATE_EMAIL_CONFIG: 'reports-configuration/CREATE_EMAIL_CONFIG',
  CREATE_TEAM_CONFIG: 'reports-configuration/CREATE_TEAM_CONFIG',
  UPDATE_TEAM_CONFIG: 'reports-configuration/UPDATE_TEAM_CONFIG',
  SET_EMAIL_CONFIG: 'reports-configuration/SET_EMAIL_CONFIG',
  UPDATE_EMAIL_CONFIG: 'reports-configuration/UPDATE_EMAIL_CONFIG',
  FETCH_TEAM_CONFIG: 'reports-configuration/FETCH_TEAM_CONFIG',
  SET_TEAM_CONFIG: 'reports-configuration/SET_TEAM_CONFIG',
  RESET_TEAM_CONFIG: 'reports-configuration/RESET_TEAM_CONFIG',
  FETCH_JIRA_CONFIG: 'reports-configuration/FETCH_JIRA_CONFIG',
  DELETE_CHANNEL_CONFIG: 'reports-configuration/DELETE_CHANNEL_CONFIG',
};

const initialState = {
  loading: false,
  errorMessage: null,
  channelParameters: [],
  channelParametersFetched: false,
  updateSuccess: false,
  emailConfig: emailConfigDefaultValue,
  teams: [],
  updating: false,
  teamConfig: teamConfigDefaultValue,
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

    case REQUEST(ACTION_TYPES.FETCH_TEAM_CONFIG):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_TEAM_CONFIG):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_TEAM_CONFIG):
      return {
        ...state,
        loading: false,
        teams: action.payload.data,
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
    case REQUEST(ACTION_TYPES.CREATE_TEAM_CONFIG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.CREATE_TEAM_CONFIG):
      return {
        ...state,

        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.CREATE_TEAM_CONFIG):
      return {
        ...state,
        teamConfig: action.payload.data,
        updateSuccess: true,
        updating: false,
      };
    case REQUEST(ACTION_TYPES.UPDATE_TEAM_CONFIG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.UPDATE_TEAM_CONFIG):
      return {
        ...state,

        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_TEAM_CONFIG):
      return {
        ...state,
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
        emailConfig: emailConfigDefaultValue,
        updateSuccess: true,
        updating: false,
      };
    case ACTION_TYPES.SET_EMAIL_CONFIG:
      return {
        ...state,
        emailConfig: action.payload,
      };
    case ACTION_TYPES.SET_TEAM_CONFIG:
      return {
        ...state,
        teamConfig: action.payload,
      };

    case ACTION_TYPES.RESET_TEAM_CONFIG:
      return {
        ...state,
        teamConfig: teamConfigDefaultValue,
        updateSuccess: false,
        updating: false,
        errorMessage: null,
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

export const createTeamConfig = (teamConfig: ITeamConfig) => ({
  type: ACTION_TYPES.CREATE_TEAM_CONFIG,
  payload: axios.post(`${apiUrl}/createTeamConfig`, teamConfig),
});

export const updateTeamConfig = (teamConfig: ITeamConfig) => ({
  type: ACTION_TYPES.UPDATE_TEAM_CONFIG,
  payload: axios.put(`${apiUrl}/updateTeamConfig`, teamConfig),
});

export const setEmailConfig = (emailConfig: IEmailConfig) => ({
  type: ACTION_TYPES.SET_EMAIL_CONFIG,
  payload: emailConfig,
});

export const setTeamConfig = (teamConfig: IEmailConfig) => ({
  type: ACTION_TYPES.SET_TEAM_CONFIG,
  payload: teamConfig,
});

export const resetTeamConfig = () => ({
  type: ACTION_TYPES.RESET_TEAM_CONFIG,
});

export const setConfig = (config: IEmailConfig | ITeamConfig) => dispatch => {
  if (config['webhookName'] !== undefined) {
    dispatch(setTeamConfig(config));
  } else if (config['host'] !== undefined && config['sender'] !== undefined) {
    dispatch(setEmailConfig(config));
  }
};

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
