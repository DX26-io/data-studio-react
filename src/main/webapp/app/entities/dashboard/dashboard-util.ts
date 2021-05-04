import { translate } from 'react-jhipster';
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
