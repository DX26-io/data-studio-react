import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import DashboardUpdatePage from './dashboard-update.page-object';

const expect = chai.expect;
export class DashboardDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('datastudioApp.dashboard.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-dashboard'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class DashboardComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('dashboard-heading'));
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
    await navBarPage.getEntityPage('dashboard');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateDashboard() {
    await this.createButton.click();
    return new DashboardUpdatePage();
  }

  async deleteDashboard() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const dashboardDeleteDialog = new DashboardDeleteDialog();
    await waitUntilDisplayed(dashboardDeleteDialog.deleteModal);
    expect(await dashboardDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/datastudioApp.dashboard.delete.question/);
    await dashboardDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(dashboardDeleteDialog.deleteModal);

    expect(await isVisible(dashboardDeleteDialog.deleteModal)).to.be.false;
  }
}
