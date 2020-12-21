import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import FeatureUpdatePage from './feature-update.page-object';

const expect = chai.expect;
export class FeatureDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('datastudioApp.feature.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-feature'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class FeatureComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('feature-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('feature');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateFeature() {
    await this.createButton.click();
    return new FeatureUpdatePage();
  }

  async deleteFeature() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const featureDeleteDialog = new FeatureDeleteDialog();
    await waitUntilDisplayed(featureDeleteDialog.deleteModal);
    expect(await featureDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/datastudioApp.feature.delete.question/);
    await featureDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(featureDeleteDialog.deleteModal);

    expect(await isVisible(featureDeleteDialog.deleteModal)).to.be.false;
  }
}
