import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocieteHomeComponent } from './societe-home.component';

describe('SocieteHomeComponent', () => {
  let component: SocieteHomeComponent;
  let fixture: ComponentFixture<SocieteHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocieteHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocieteHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
