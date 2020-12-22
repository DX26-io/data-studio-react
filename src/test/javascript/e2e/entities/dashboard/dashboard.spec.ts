import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import DashboardComponentsPage from './dashboard.page-object';
import DashboardUpdatePage from './dashboard-update.page-object';
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

describe('Dashboard e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let dashboardComponentsPage: DashboardComponentsPage;
  let dashboardUpdatePage: DashboardUpdatePage;

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
    dashboardComponentsPage = new DashboardComponentsPage();
    dashboardComponentsPage = await dashboardComponentsPage.goToPage(navBarPage);
  });

  it('should load Dashboards', async () => {
    expect(await dashboardComponentsPage.title.getText()).to.match(/Dashboards/);
    expect(await dashboardComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Dashboards', async () => {
    const beforeRecordsCount = (await isVisible(dashboardComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(dashboardComponentsPage.table);
    dashboardUpdatePage = await dashboardComponentsPage.goToCreateDashboard();
    await dashboardUpdatePage.enterData();

    expect(await dashboardComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(dashboardComponentsPage.table);
    await waitUntilCount(dashboardComponentsPage.records, beforeRecordsCount + 1);
    expect(await dashboardComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await dashboardComponentsPage.deleteDashboard();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(dashboardComponentsPage.records, beforeRecordsCount);
      expect(await dashboardComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(dashboardComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
