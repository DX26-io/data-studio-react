import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class DashboardUpdatePage {
  pageTitle: ElementFinder = element(by.id('datastudioApp.dashboard.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  dashboard_nameInput: ElementFinder = element(by.css('input#dashboard-dashboard_name'));
  categoryInput: ElementFinder = element(by.css('input#dashboard-category'));
  descriptionInput: ElementFinder = element(by.css('input#dashboard-description'));
  publishedInput: ElementFinder = element(by.css('input#dashboard-published'));
  image_locationInput: ElementFinder = element(by.css('input#dashboard-image_location'));
  image_content_typeInput: ElementFinder = element(by.css('input#dashboard-image_content_type'));
  dashboard_datasource_idInput: ElementFinder = element(by.css('input#dashboard-dashboard_datasource_id'));
  created_byInput: ElementFinder = element(by.css('input#dashboard-created_by'));
  created_dateInput: ElementFinder = element(by.css('input#dashboard-created_date'));
  last_modified_byInput: ElementFinder = element(by.css('input#dashboard-last_modified_by'));
  last_modified_dateInput: ElementFinder = element(by.css('input#dashboard-last_modified_date'));
  current_release_idInput: ElementFinder = element(by.css('input#dashboard-current_release_id'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setDashboardNameInput(dashboardName) {
    await this.dashboard_nameInput.sendKeys(dashboardName);
  }

  async getDashboardNameInput() {
    return this.dashboard_nameInput.getAttribute('value');
  }

  async setCategoryInput(category) {
    await this.categoryInput.sendKeys(category);
  }

  async getCategoryInput() {
    return this.categoryInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  getPublishedInput() {
    return this.publishedInput;
  }
  async setImageLocationInput(imageLocation) {
    await this.image_locationInput.sendKeys(imageLocation);
  }

  async getImageLocationInput() {
    return this.image_locationInput.getAttribute('value');
  }

  async setImageContentTypeInput(imageContentType) {
    await this.image_content_typeInput.sendKeys(imageContentType);
  }

  async getImageContentTypeInput() {
    return this.image_content_typeInput.getAttribute('value');
  }

  async setDashboardDatasourceIdInput(dashboardDatasourceId) {
    await this.dashboard_datasource_idInput.sendKeys(dashboardDatasourceId);
  }

  async getDashboardDatasourceIdInput() {
    return this.dashboard_datasource_idInput.getAttribute('value');
  }

  async setCreatedByInput(createdBy) {
    await this.created_byInput.sendKeys(createdBy);
  }

  async getCreatedByInput() {
    return this.created_byInput.getAttribute('value');
  }

  async setCreatedDateInput(createdDate) {
    await this.created_dateInput.sendKeys(createdDate);
  }

  async getCreatedDateInput() {
    return this.created_dateInput.getAttribute('value');
  }

  async setLastModifiedByInput(lastModifiedBy) {
    await this.last_modified_byInput.sendKeys(lastModifiedBy);
  }

  async getLastModifiedByInput() {
    return this.last_modified_byInput.getAttribute('value');
  }

  async setLastModifiedDateInput(lastModifiedDate) {
    await this.last_modified_dateInput.sendKeys(lastModifiedDate);
  }

  async getLastModifiedDateInput() {
    return this.last_modified_dateInput.getAttribute('value');
  }

  async setCurrentReleaseIdInput(currentReleaseId) {
    await this.current_release_idInput.sendKeys(currentReleaseId);
  }

  async getCurrentReleaseIdInput() {
    return this.current_release_idInput.getAttribute('value');
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setDashboardNameInput('dashboard_name');
    expect(await this.getDashboardNameInput()).to.match(/dashboard_name/);
    await waitUntilDisplayed(this.saveButton);
    await this.setCategoryInput('category');
    expect(await this.getCategoryInput()).to.match(/category/);
    await waitUntilDisplayed(this.saveButton);
    await this.setDescriptionInput('description');
    expect(await this.getDescriptionInput()).to.match(/description/);
    await waitUntilDisplayed(this.saveButton);
    const selectedPublished = await this.getPublishedInput().isSelected();
    if (selectedPublished) {
      await this.getPublishedInput().click();
      expect(await this.getPublishedInput().isSelected()).to.be.false;
    } else {
      await this.getPublishedInput().click();
      expect(await this.getPublishedInput().isSelected()).to.be.true;
    }
    await waitUntilDisplayed(this.saveButton);
    await this.setImageLocationInput('image_location');
    expect(await this.getImageLocationInput()).to.match(/image_location/);
    await waitUntilDisplayed(this.saveButton);
    await this.setImageContentTypeInput('image_content_type');
    expect(await this.getImageContentTypeInput()).to.match(/image_content_type/);
    await waitUntilDisplayed(this.saveButton);
    await this.setDashboardDatasourceIdInput('5');
    expect(await this.getDashboardDatasourceIdInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setCreatedByInput('created_by');
    expect(await this.getCreatedByInput()).to.match(/created_by/);
    await waitUntilDisplayed(this.saveButton);
    await this.setCreatedDateInput('01-01-2001');
    expect(await this.getCreatedDateInput()).to.eq('2001-01-01');
    await waitUntilDisplayed(this.saveButton);
    await this.setLastModifiedByInput('last_modified_by');
    expect(await this.getLastModifiedByInput()).to.match(/last_modified_by/);
    await waitUntilDisplayed(this.saveButton);
    await this.setLastModifiedDateInput('01-01-2001');
    expect(await this.getLastModifiedDateInput()).to.eq('2001-01-01');
    await waitUntilDisplayed(this.saveButton);
    await this.setCurrentReleaseIdInput('5');
    expect(await this.getCurrentReleaseIdInput()).to.eq('5');
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
