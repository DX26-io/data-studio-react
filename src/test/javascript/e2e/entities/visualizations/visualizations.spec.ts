import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import VisualisationsComponentsPage from './visualizations.page-object';
import VisualisationsUpdatePage from './visualizations-update.page-object';
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

describe('Visualisations e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let visualisationsComponentsPage: VisualisationsComponentsPage;
  let visualisationsUpdatePage: VisualisationsUpdatePage;

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
    visualisationsComponentsPage = new VisualisationsComponentsPage();
    visualisationsComponentsPage = await visualisationsComponentsPage.goToPage(navBarPage);
  });

  it('should load visualisations', async () => {
    expect(await visualisationsComponentsPage.title.getText()).to.match(/visualisations/);
    expect(await visualisationsComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete visualisations', async () => {
    const beforeRecordsCount = (await isVisible(visualisationsComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(visualisationsComponentsPage.table);
    visualisationsUpdatePage = await visualisationsComponentsPage.goToCreatevisualisations();
    await visualisationsUpdatePage.enterData();

    expect(await visualisationsComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(visualisationsComponentsPage.table);
    await waitUntilCount(visualisationsComponentsPage.records, beforeRecordsCount + 1);
    expect(await visualisationsComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await visualisationsComponentsPage.deleteVisualisations();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(visualisationsComponentsPage.records, beforeRecordsCount);
      expect(await visualisationsComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(visualisationsComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
