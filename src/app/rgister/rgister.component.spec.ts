import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgisterComponent } from './rgister.component';

describe('RgisterComponent', () => {
  let component: RgisterComponent;
  let fixture: ComponentFixture<RgisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
