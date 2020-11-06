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

  async setDashboard_nameInput(dashboard_name) {
    await this.dashboard_nameInput.sendKeys(dashboard_name);
  }

  async getDashboard_nameInput() {
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
  async setImage_locationInput(image_location) {
    await this.image_locationInput.sendKeys(image_location);
  }

  async getImage_locationInput() {
    return this.image_locationInput.getAttribute('value');
  }

  async setImage_content_typeInput(image_content_type) {
    await this.image_content_typeInput.sendKeys(image_content_type);
  }

  async getImage_content_typeInput() {
    return this.image_content_typeInput.getAttribute('value');
  }

  async setDashboard_datasource_idInput(dashboard_datasource_id) {
    await this.dashboard_datasource_idInput.sendKeys(dashboard_datasource_id);
  }

  async getDashboard_datasource_idInput() {
    return this.dashboard_datasource_idInput.getAttribute('value');
  }

  async setCreated_byInput(created_by) {
    await this.created_byInput.sendKeys(created_by);
  }

  async getCreated_byInput() {
    return this.created_byInput.getAttribute('value');
  }

  async setCreated_dateInput(created_date) {
    await this.created_dateInput.sendKeys(created_date);
  }

  async getCreated_dateInput() {
    return this.created_dateInput.getAttribute('value');
  }

  async setLast_modified_byInput(last_modified_by) {
    await this.last_modified_byInput.sendKeys(last_modified_by);
  }

  async getLast_modified_byInput() {
    return this.last_modified_byInput.getAttribute('value');
  }

  async setLast_modified_dateInput(last_modified_date) {
    await this.last_modified_dateInput.sendKeys(last_modified_date);
  }

  async getLast_modified_dateInput() {
    return this.last_modified_dateInput.getAttribute('value');
  }

  async setCurrent_release_idInput(current_release_id) {
    await this.current_release_idInput.sendKeys(current_release_id);
  }

  async getCurrent_release_idInput() {
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
    await this.setDashboard_nameInput('dashboard_name');
    expect(await this.getDashboard_nameInput()).to.match(/dashboard_name/);
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
    await this.setImage_locationInput('image_location');
    expect(await this.getImage_locationInput()).to.match(/image_location/);
    await waitUntilDisplayed(this.saveButton);
    await this.setImage_content_typeInput('image_content_type');
    expect(await this.getImage_content_typeInput()).to.match(/image_content_type/);
    await waitUntilDisplayed(this.saveButton);
    await this.setDashboard_datasource_idInput('5');
    expect(await this.getDashboard_datasource_idInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setCreated_byInput('created_by');
    expect(await this.getCreated_byInput()).to.match(/created_by/);
    await waitUntilDisplayed(this.saveButton);
    await this.setCreated_dateInput('01-01-2001');
    expect(await this.getCreated_dateInput()).to.eq('2001-01-01');
    await waitUntilDisplayed(this.saveButton);
    await this.setLast_modified_byInput('last_modified_by');
    expect(await this.getLast_modified_byInput()).to.match(/last_modified_by/);
    await waitUntilDisplayed(this.saveButton);
    await this.setLast_modified_dateInput('01-01-2001');
    expect(await this.getLast_modified_dateInput()).to.eq('2001-01-01');
    await waitUntilDisplayed(this.saveButton);
    await this.setCurrent_release_idInput('5');
    expect(await this.getCurrent_release_idInput()).to.eq('5');
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
