import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoponeComponent } from './shopone.component';

describe('ShoponeComponent', () => {
  let component: ShoponeComponent;
  let fixture: ComponentFixture<ShoponeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoponeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoponeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
