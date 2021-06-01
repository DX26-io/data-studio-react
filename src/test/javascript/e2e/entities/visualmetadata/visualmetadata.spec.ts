import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import VisualmetadataComponentsPage from './visualmetadata.page-object';
import VisualmetadataUpdatePage from './visualmetadata-update.page-object';
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

describe('Visualmetadata e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let visualmetadataComponentsPage: VisualmetadataComponentsPage;
  let visualmetadataUpdatePage: VisualmetadataUpdatePage;

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
    visualmetadataComponentsPage = new VisualmetadataComponentsPage();
    visualmetadataComponentsPage = await visualmetadataComponentsPage.goToPage(navBarPage);
  });

  it('should load Visualmetadata', async () => {
    expect(await visualmetadataComponentsPage.title.getText()).to.match(/Visualmetadata/);
    expect(await visualmetadataComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Visualmetadata', async () => {
    const beforeRecordsCount = (await isVisible(visualmetadataComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(visualmetadataComponentsPage.table);
    visualmetadataUpdatePage = await visualmetadataComponentsPage.goToCreateVisualmetadata();
    await visualmetadataUpdatePage.enterData();

    expect(await visualmetadataComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(visualmetadataComponentsPage.table);
    await waitUntilCount(visualmetadataComponentsPage.records, beforeRecordsCount + 1);
    expect(await visualmetadataComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await visualmetadataComponentsPage.deleteVisualmetadata();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(visualmetadataComponentsPage.records, beforeRecordsCount);
      expect(await visualmetadataComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(visualmetadataComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
