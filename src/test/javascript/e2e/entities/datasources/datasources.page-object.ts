import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import DatasourcesUpdatePage from './datasources-update.page-object';

const expect = chai.expect;
export class DatasourcesDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('datastudioApp.datasources.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-datasources'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class DatasourcesComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('datasources-heading'));
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
    await navBarPage.getEntityPage('datasources');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateDatasources() {
    await this.createButton.click();
    return new DatasourcesUpdatePage();
  }

  async deleteDatasources() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const datasourcesDeleteDialog = new DatasourcesDeleteDialog();
    await waitUntilDisplayed(datasourcesDeleteDialog.deleteModal);
    expect(await datasourcesDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/datastudioApp.datasources.delete.question/);
    await datasourcesDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(datasourcesDeleteDialog.deleteModal);

    expect(await isVisible(datasourcesDeleteDialog.deleteModal)).to.be.false;
  }
}
