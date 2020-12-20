import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ViewsComponentsPage from './views.page-object';
import ViewsUpdatePage from './views-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('Views e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let viewsComponentsPage: ViewsComponentsPage;
  let viewsUpdatePage: ViewsUpdatePage;

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
    viewsComponentsPage = new ViewsComponentsPage();
    viewsComponentsPage = await viewsComponentsPage.goToPage(navBarPage);
  });

  it('should load Views', async () => {
    expect(await viewsComponentsPage.title.getText()).to.match(/Views/);
    expect(await viewsComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Views', async () => {
    const beforeRecordsCount = (await isVisible(viewsComponentsPage.noRecords)) ? 0 : await getRecordsCount(viewsComponentsPage.table);
    viewsUpdatePage = await viewsComponentsPage.goToCreateViews();
    await viewsUpdatePage.enterData();

    expect(await viewsComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(viewsComponentsPage.table);
    await waitUntilCount(viewsComponentsPage.records, beforeRecordsCount + 1);
    expect(await viewsComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await viewsComponentsPage.deleteViews();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(viewsComponentsPage.records, beforeRecordsCount);
      expect(await viewsComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(viewsComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
