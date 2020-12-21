import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import VisualizationsUpdatePage from './visualizations-update.page-object';

const expect = chai.expect;
export class VisualizationsDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('datastudioApp.visualizations.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-visualizations'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class VisualizationsComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('visualizations-heading'));
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
    await navBarPage.getEntityPage('visualizations');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateVisualizations() {
    await this.createButton.click();
    return new VisualizationsUpdatePage();
  }

  async deleteVisualizations() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const visualizationsDeleteDialog = new VisualizationsDeleteDialog();
    await waitUntilDisplayed(visualizationsDeleteDialog.deleteModal);
    expect(await visualizationsDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/datastudioApp.visualizations.delete.question/);
    await visualizationsDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(visualizationsDeleteDialog.deleteModal);

    expect(await isVisible(visualizationsDeleteDialog.deleteModal)).to.be.false;
  }
}
