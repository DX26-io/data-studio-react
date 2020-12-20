import { translate } from 'react-jhipster';

/**
 * This method returns an object that contains dashboard form labels
 */
export const getDashboardFromTranslations = (): any => {
  return {
    DASHBOARD_LABEL: translate('dashboard.dashboard_name'),
    CATEGORY_LABEL: translate('dashboard.category'),
    DESCRIPTION_LABEL: translate('dashboard.description'),
    DATASOURCE_LABEL: translate('dashboard.datasource'),
    DATASOURCE_PLACEHOLDER: translate('dashboard.datasource_placeholder'),
  };
};

/**
 * This method returns an object that contains dashboard success translations
 */
export const getDashboardSuccessTranslations = (): any => {
  return {
    SUCCESS_LABEL: translate('dashboard.created.header'),
    SUCCESS_CLOSE_LABEL: translate('entity.action.cancel'),
    PRIMARY_ACTION_LABEL: translate('entity.action.open'),
  };
};

/**
 * This method returns an object that contains dashboard error translations
 */
export const getDashboardErrorTranslations = (): any => {
  return {
    ERROR_LABEL: translate('dashboard.error.header'),
    ERROR_CLOSE_LABEL: translate('entity.action.cancel'),
  };
};

interface IFormData {
  dashboardName: string;
  dashboardCategory: string;
  dashboardDataSource: string;
}

/**
 * This method validates the create and edit form enable
 * create or save button respectively
 * @param dashboardName
 * @param dashboardCategory
 * @param dashboardDataSource
 */
export const isCreateEditFormNotValid = ({ dashboardName, dashboardCategory, dashboardDataSource }: IFormData): boolean => {
  return dashboardName === '' || dashboardCategory === '' || dashboardDataSource === '';
};
