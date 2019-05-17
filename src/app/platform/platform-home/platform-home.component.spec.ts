import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformHomeComponent } from './platform-home.component';

describe('PlatformHomeComponent', () => {
  let component: PlatformHomeComponent;
  let fixture: ComponentFixture<PlatformHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
