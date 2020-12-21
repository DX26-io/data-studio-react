import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import FeatureComponentsPage from './feature.page-object';
import FeatureUpdatePage from './feature-update.page-object';
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

describe('Feature e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let featureComponentsPage: FeatureComponentsPage;
  let featureUpdatePage: FeatureUpdatePage;

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
    featureComponentsPage = new FeatureComponentsPage();
    featureComponentsPage = await featureComponentsPage.goToPage(navBarPage);
  });

  it('should load Features', async () => {
    expect(await featureComponentsPage.title.getText()).to.match(/Features/);
    expect(await featureComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Features', async () => {
    const beforeRecordsCount = (await isVisible(featureComponentsPage.noRecords)) ? 0 : await getRecordsCount(featureComponentsPage.table);
    featureUpdatePage = await featureComponentsPage.goToCreateFeature();
    await featureUpdatePage.enterData();

    expect(await featureComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(featureComponentsPage.table);
    await waitUntilCount(featureComponentsPage.records, beforeRecordsCount + 1);
    expect(await featureComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await featureComponentsPage.deleteFeature();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(featureComponentsPage.records, beforeRecordsCount);
      expect(await featureComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(featureComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
