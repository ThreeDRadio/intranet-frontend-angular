import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewMessagesPage } from "./view-messages";

describe("ViewMessages", () => {
  let component: ViewMessagesPage;
  let fixture: ComponentFixture<ViewMessagesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMessagesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMessagesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
