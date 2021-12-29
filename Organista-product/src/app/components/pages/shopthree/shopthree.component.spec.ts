import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopthreeComponent } from './shopthree.component';

describe('ShopthreeComponent', () => {
  let component: ShopthreeComponent;
  let fixture: ComponentFixture<ShopthreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopthreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopthreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
