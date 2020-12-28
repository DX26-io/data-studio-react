import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class VisualmetadataUpdatePage {
  pageTitle: ElementFinder = element(by.id('datastudioApp.visualmetadata.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  heightInput: ElementFinder = element(by.css('input#visualmetadata-height'));
  widthInput: ElementFinder = element(by.css('input#visualmetadata-width'));
  visualBuildIdInput: ElementFinder = element(by.css('input#visualmetadata-visualBuildId'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setHeightInput(height) {
    await this.heightInput.sendKeys(height);
  }

  async getHeightInput() {
    return this.heightInput.getAttribute('value');
  }

  async setWidthInput(width) {
    await this.widthInput.sendKeys(width);
  }

  async getWidthInput() {
    return this.widthInput.getAttribute('value');
  }

  async setVisualBuildIdInput(visualBuildId) {
    await this.visualBuildIdInput.sendKeys(visualBuildId);
  }

  async getVisualBuildIdInput() {
    return this.visualBuildIdInput.getAttribute('value');
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
    await this.setHeightInput('5');
    expect(await this.getHeightInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setWidthInput('5');
    expect(await this.getWidthInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setVisualBuildIdInput('visualBuildId');
    expect(await this.getVisualBuildIdInput()).to.match(/visualBuildId/);
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
