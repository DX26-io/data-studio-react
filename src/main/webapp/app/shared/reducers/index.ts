import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/users/user.reducer';
import userGroups, { UserGroupsState } from 'app/modules/administration/user-management/groups/user-group.reducer';
import permissions, { PermissionsState } from 'app/modules/administration/user-management/permissions/permissions.reducer';
import datasourceConstraints, {
  DatasourceConstraintsState,
} from 'app/modules/administration/user-management/permissions/datasource-constraints/datasource-constraints.reducer';
import connections, { ConnectionsState } from 'app/modules/administration/sources/connections/connection.reducer';
import datasources, { DatasourcesState } from 'app/modules/administration/sources/datasources/datasources.reducer';
import datasourceSteps, { DatasourceStepsState } from 'app/modules/administration/sources/datasources/steps/datasource-steps.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
import home, { HomeState } from 'app/modules/home/home.reducer';
import recent, { RecentState } from 'app/modules/home/sections/recent.reducer';
import reportConfiguration, {
  ReportConfigurationState,
} from 'app/modules/administration/reports-configuration/reports-configuration.reducer';
import reportsManagement, { ReportsManagementState } from 'app/entities/reports-management/reports-management.reducer';
import visualizationData, { VisualDataState } from 'app/shared/websocket/websocket.reducer';

// prettier-ignore
import dashboard, {
  DashboardState
} from 'app/entities/dashboard/dashboard.reducer';
// prettier-ignore
import views, {
  ViewsState
} from 'app/entities/views/views.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly userGroups: UserGroupsState;
  readonly permissions: PermissionsState;
  readonly datasourceConstraints: DatasourceConstraintsState;
  readonly connections: ConnectionsState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly dashboard: DashboardState;
  readonly datasources: DatasourcesState;
  readonly datasourceSteps: DatasourceStepsState;
  readonly views: ViewsState;
  readonly home: HomeState;
  readonly recent: RecentState;
  readonly reportConfiguration: ReportConfigurationState;
  readonly reportsManagement: ReportsManagementState;
  readonly visualizationData: VisualDataState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  userGroups,
  permissions,
  datasourceConstraints,
  connections,
  datasourceSteps,
  register,
  activate,
  passwordReset,
  password,
  settings,
  dashboard,
  datasources,
  views,
  home,
  reportConfiguration,
  reportsManagement,
  visualizationData,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
  recent,
});

export default rootReducer;
