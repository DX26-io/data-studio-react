import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import VisualmetadataUpdatePage from './visualmetadata-update.page-object';

const expect = chai.expect;
export class VisualmetadataDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('datastudioApp.visualmetadata.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-visualmetadata'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class VisualmetadataComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('visualmetadata-heading'));
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
    await navBarPage.getEntityPage('visualmetadata');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateVisualmetadata() {
    await this.createButton.click();
    return new VisualmetadataUpdatePage();
  }

  async deleteVisualmetadata() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const visualmetadataDeleteDialog = new VisualmetadataDeleteDialog();
    await waitUntilDisplayed(visualmetadataDeleteDialog.deleteModal);
    expect(await visualmetadataDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/datastudioApp.visualmetadata.delete.question/);
    await visualmetadataDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(visualmetadataDeleteDialog.deleteModal);

    expect(await isVisible(visualmetadataDeleteDialog.deleteModal)).to.be.false;
  }
}
