import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoptwoComponent } from './shoptwo.component';

describe('ShoptwoComponent', () => {
  let component: ShoptwoComponent;
  let fixture: ComponentFixture<ShoptwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoptwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoptwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
