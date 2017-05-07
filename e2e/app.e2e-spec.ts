import { IntranetAngularPage } from './app.po';

describe('intranet-angular App', () => {
  let page: IntranetAngularPage;

  beforeEach(() => {
    page = new IntranetAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
