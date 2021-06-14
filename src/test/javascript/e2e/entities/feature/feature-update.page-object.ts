import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class FeatureUpdatePage {
  pageTitle: ElementFinder = element(by.id('features.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  datasourceIdInput: ElementFinder = element(by.css('input#feature-datasourceId'));
  dateFilterInput: ElementFinder = element(by.css('input#feature-dateFilter'));
  definitionInput: ElementFinder = element(by.css('input#feature-definition'));
  favouriteFilterInput: ElementFinder = element(by.css('input#feature-favouriteFilter'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setDatasourceIdInput(datasourceId) {
    await this.datasourceIdInput.sendKeys(datasourceId);
  }

  async getDatasourceIdInput() {
    return this.datasourceIdInput.getAttribute('value');
  }

  async setDateFilterInput(dateFilter) {
    await this.dateFilterInput.sendKeys(dateFilter);
  }

  async getDateFilterInput() {
    return this.dateFilterInput.getAttribute('value');
  }

  async setDefinitionInput(definition) {
    await this.definitionInput.sendKeys(definition);
  }

  async getDefinitionInput() {
    return this.definitionInput.getAttribute('value');
  }

  getFavouriteFilterInput() {
    return this.favouriteFilterInput;
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
    await this.setDatasourceIdInput('datasourceId');
    expect(await this.getDatasourceIdInput()).to.match(/datasourceId/);
    await waitUntilDisplayed(this.saveButton);
    await this.setDateFilterInput('dateFilter');
    expect(await this.getDateFilterInput()).to.match(/dateFilter/);
    await waitUntilDisplayed(this.saveButton);
    await this.setDefinitionInput('definition');
    expect(await this.getDefinitionInput()).to.match(/definition/);
    await waitUntilDisplayed(this.saveButton);
    const selectedFavouriteFilter = await this.getFavouriteFilterInput().isSelected();
    if (selectedFavouriteFilter) {
      await this.getFavouriteFilterInput().click();
      expect(await this.getFavouriteFilterInput().isSelected()).to.be.false;
    } else {
      await this.getFavouriteFilterInput().click();
      expect(await this.getFavouriteFilterInput().isSelected()).to.be.true;
    }
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
