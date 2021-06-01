import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import VisualizationsComponentsPage from './visualizations.page-object';
import VisualizationsUpdatePage from './visualizations-update.page-object';
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

describe('Visualizations e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let visualizationsComponentsPage: VisualizationsComponentsPage;
  let visualizationsUpdatePage: VisualizationsUpdatePage;

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
    visualizationsComponentsPage = new VisualizationsComponentsPage();
    visualizationsComponentsPage = await visualizationsComponentsPage.goToPage(navBarPage);
  });

  it('should load Visualizations', async () => {
    expect(await visualizationsComponentsPage.title.getText()).to.match(/Visualizations/);
    expect(await visualizationsComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Visualizations', async () => {
    const beforeRecordsCount = (await isVisible(visualizationsComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(visualizationsComponentsPage.table);
    visualizationsUpdatePage = await visualizationsComponentsPage.goToCreateVisualizations();
    await visualizationsUpdatePage.enterData();

    expect(await visualizationsComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(visualizationsComponentsPage.table);
    await waitUntilCount(visualizationsComponentsPage.records, beforeRecordsCount + 1);
    expect(await visualizationsComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await visualizationsComponentsPage.deleteVisualizations();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(visualizationsComponentsPage.records, beforeRecordsCount);
      expect(await visualizationsComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(visualizationsComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
