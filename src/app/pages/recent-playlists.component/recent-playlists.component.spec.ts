import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecentPlaylistsComponent } from "./recent-playlists.component";

describe("RecentPlaylistsComponent", () => {
  let component: RecentPlaylistsComponent;
  let fixture: ComponentFixture<RecentPlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentPlaylistsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentPlaylistsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
