import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class DatasourcesUpdatePage {
  pageTitle: ElementFinder = element(by.id('datastudioApp.datasources.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  nameInput: ElementFinder = element(by.css('input#datasources-name'));
  lastUpdatedInput: ElementFinder = element(by.css('input#datasources-lastUpdated'));
  connectionNameInput: ElementFinder = element(by.css('input#datasources-connectionName'));
  queryPathInput: ElementFinder = element(by.css('input#datasources-queryPath'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return this.nameInput.getAttribute('value');
  }

  async setLastUpdatedInput(lastUpdated) {
    await this.lastUpdatedInput.sendKeys(lastUpdated);
  }

  async getLastUpdatedInput() {
    return this.lastUpdatedInput.getAttribute('value');
  }

  async setConnectionNameInput(connectionName) {
    await this.connectionNameInput.sendKeys(connectionName);
  }

  async getConnectionNameInput() {
    return this.connectionNameInput.getAttribute('value');
  }

  async setQueryPathInput(queryPath) {
    await this.queryPathInput.sendKeys(queryPath);
  }

  async getQueryPathInput() {
    return this.queryPathInput.getAttribute('value');
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
    await this.setNameInput('name');
    expect(await this.getNameInput()).to.match(/name/);
    await waitUntilDisplayed(this.saveButton);
    await this.setLastUpdatedInput('01-01-2001');
    expect(await this.getLastUpdatedInput()).to.eq('2001-01-01');
    await waitUntilDisplayed(this.saveButton);
    await this.setConnectionNameInput('connectionName');
    expect(await this.getConnectionNameInput()).to.match(/connectionName/);
    await waitUntilDisplayed(this.saveButton);
    await this.setQueryPathInput('queryPath');
    expect(await this.getQueryPathInput()).to.match(/queryPath/);
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
