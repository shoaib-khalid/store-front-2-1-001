import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopfourComponent } from './shopfour.component';

describe('ShopfourComponent', () => {
  let component: ShopfourComponent;
  let fixture: ComponentFixture<ShopfourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopfourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopfourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
