import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/users/user.reducer';
import userGroups, { UserGroupsState } from 'app/modules/administration/user-management/groups/user-group.reducer';
import permission, { PermissionState } from 'app/modules/administration/user-management/permission/permission.reducer';
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
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly userGroups: UserGroupsState;
  readonly permission: PermissionState;
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
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  userGroups,
  permission,
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
});

export default rootReducer;
