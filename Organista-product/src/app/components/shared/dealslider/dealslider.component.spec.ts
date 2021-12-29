import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsliderComponent } from './dealslider.component';

describe('DealsliderComponent', () => {
  let component: DealsliderComponent;
  let fixture: ComponentFixture<DealsliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealsliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
