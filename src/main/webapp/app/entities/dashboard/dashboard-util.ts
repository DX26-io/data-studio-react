import { translate } from 'react-jhipster';
interface IFormData {
  name: string;
  category: string;
  dashboardDataSource: string;
}

/**
 * This method validates the create and edit form enable
 * create or save button respectively
 * @param name
 * @param category
 * @param dashboardDataSource
 */
export const isCreateEditFormNotValid = ({ name, category, dashboardDataSource }: IFormData): boolean => {
  return name === '' || category === '' || dashboardDataSource === '';
};

export const generateDatasourcesOptions = datasources => {
  const options = [];
  datasources &&
    datasources.forEach(item => {
      options.push({ value: item.name, label: item.name });
    });
  return options;
};
