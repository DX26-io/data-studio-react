import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import DatasourcesComponentsPage from './datasources.page-object';
import DatasourcesUpdatePage from './datasources-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Datasources e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let datasourcesComponentsPage: DatasourcesComponentsPage;
  let datasourcesUpdatePage: DatasourcesUpdatePage;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    datasourcesComponentsPage = new DatasourcesComponentsPage();
    datasourcesComponentsPage = await datasourcesComponentsPage.goToPage(navBarPage);
  });

  it('should load Datasources', async () => {
    expect(await datasourcesComponentsPage.title.getText()).to.match(/Datasources/);
    expect(await datasourcesComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Datasources', async () => {
    const beforeRecordsCount = (await isVisible(datasourcesComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(datasourcesComponentsPage.table);
    datasourcesUpdatePage = await datasourcesComponentsPage.goToCreateDatasources();
    await datasourcesUpdatePage.enterData();

    expect(await datasourcesComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(datasourcesComponentsPage.table);
    await waitUntilCount(datasourcesComponentsPage.records, beforeRecordsCount + 1);
    expect(await datasourcesComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await datasourcesComponentsPage.deleteDatasources();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(datasourcesComponentsPage.records, beforeRecordsCount);
      expect(await datasourcesComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(datasourcesComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
