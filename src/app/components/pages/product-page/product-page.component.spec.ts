import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductpageComponent } from './product-page.component';

describe('ProductPageComponent', () => {
  let component: ProductpageComponent;
  let fixture: ComponentFixture<ProductpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
