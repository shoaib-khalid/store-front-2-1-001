import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsingletwoComponent } from './productsingletwo.component';

describe('ProductsingletwoComponent', () => {
  let component: ProductsingletwoComponent;
  let fixture: ComponentFixture<ProductsingletwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsingletwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsingletwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
