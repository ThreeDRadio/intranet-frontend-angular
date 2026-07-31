import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlaylistHeaderListComponent } from "./playlist-header-list.component";

describe("PlaylistHeaderListComponent", () => {
  let component: PlaylistHeaderListComponent;
  let fixture: ComponentFixture<PlaylistHeaderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistHeaderListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistHeaderListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
