import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

import path from 'path';

const expect = chai.expect;

const fileToUpload = '../../../../../../src/main/webapp/content/images/logo-jhipster.png';
const absolutePath = path.resolve(__dirname, fileToUpload);
export default class ViewsUpdatePage {
  pageTitle: ElementFinder = element(by.id('datastudioApp.views.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  viewNameInput: ElementFinder = element(by.css('input#views-viewName'));
  descriptionInput: ElementFinder = element(by.css('input#views-description'));
  createdByInput: ElementFinder = element(by.css('input#views-createdBy'));
  lastModifiedByInput: ElementFinder = element(by.css('input#views-lastModifiedBy'));
  lastModifiedDateInput: ElementFinder = element(by.css('input#views-lastModifiedDate'));
  publishedInput: ElementFinder = element(by.css('input#views-published'));
  imageInput: ElementFinder = element(by.css('input#file_image'));
  viewDashboardInput: ElementFinder = element(by.css('input#views-viewDashboard'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setViewNameInput(viewName) {
    await this.viewNameInput.sendKeys(viewName);
  }

  async getViewNameInput() {
    return this.viewNameInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async setCreatedByInput(createdBy) {
    await this.createdByInput.sendKeys(createdBy);
  }

  async getCreatedByInput() {
    return this.createdByInput.getAttribute('value');
  }

  async setLastModifiedByInput(lastModifiedBy) {
    await this.lastModifiedByInput.sendKeys(lastModifiedBy);
  }

  async getLastModifiedByInput() {
    return this.lastModifiedByInput.getAttribute('value');
  }

  async setLastModifiedDateInput(lastModifiedDate) {
    await this.lastModifiedDateInput.sendKeys(lastModifiedDate);
  }

  async getLastModifiedDateInput() {
    return this.lastModifiedDateInput.getAttribute('value');
  }

  getPublishedInput() {
    return this.publishedInput;
  }
  async setImageInput(image) {
    await this.imageInput.sendKeys(image);
  }

  async getImageInput() {
    return this.imageInput.getAttribute('value');
  }

  async setViewDashboardInput(viewDashboard) {
    await this.viewDashboardInput.sendKeys(viewDashboard);
  }

  async getViewDashboardInput() {
    return this.viewDashboardInput.getAttribute('value');
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
    await this.setViewNameInput('viewName');
    expect(await this.getViewNameInput()).to.match(/viewName/);
    await waitUntilDisplayed(this.saveButton);
    await this.setDescriptionInput('description');
    expect(await this.getDescriptionInput()).to.match(/description/);
    await waitUntilDisplayed(this.saveButton);
    await this.setCreatedByInput('createdBy');
    expect(await this.getCreatedByInput()).to.match(/createdBy/);
    await waitUntilDisplayed(this.saveButton);
    await this.setLastModifiedByInput('lastModifiedBy');
    expect(await this.getLastModifiedByInput()).to.match(/lastModifiedBy/);
    await waitUntilDisplayed(this.saveButton);
    await this.setLastModifiedDateInput('01-01-2001');
    expect(await this.getLastModifiedDateInput()).to.eq('2001-01-01');
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
    await this.setImageInput(absolutePath);
    await waitUntilDisplayed(this.saveButton);
    await this.setViewDashboardInput('viewDashboard');
    expect(await this.getViewDashboardInput()).to.match(/viewDashboard/);
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
