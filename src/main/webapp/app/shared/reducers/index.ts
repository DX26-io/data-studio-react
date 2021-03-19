import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/users/user.reducer';
import userGroups, { UserGroupsState } from 'app/modules/administration/user-management/groups/user-group.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import dashboard, {
  DashboardState
} from 'app/entities/dashboard/dashboard.reducer';
// prettier-ignore
import datasources, {
  DatasourcesState
} from 'app/entities/datasources/datasources.reducer';
// prettier-ignore
import views, {
  ViewsState
} from 'app/entities/views/views.reducer';
// prettier-ignore
import feature, {
  FeatureState
} from 'app/entities/feature/feature.reducer';
// prettier-ignore
import visualizations, {
  VisualizationsState
} from 'app/entities/visualizations/visualizations.reducer';
// prettier-ignore
import visualmetadata, {
  VisualmetadataState
} from 'app/entities/visualmetadata/visualmetadata.reducer';
import filter, { FilterState } from 'app/modules/canvas/filter/filter.reducer';
import scheduler, { SchedulerState } from 'app/modules/canvas/scheduler/scheduler.reducer';
import notification, { notificationState } from 'app/modules/canvas/scheduler/notification.reducer';

/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly userGroups: UserGroupsState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly dashboard: DashboardState;
  readonly datasources: DatasourcesState;
  readonly views: ViewsState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
  readonly filter: FilterState;
  readonly scheduler: SchedulerState;
  readonly notification: notificationState;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  userGroups,
  register,
  activate,
  passwordReset,
  password,
  settings,
  dashboard,
  datasources,
  views,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
  filter,
  scheduler,
  notification,
});

export default rootReducer;
