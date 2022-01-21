import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedpostComponent } from './relatedpost.component';

describe('RelatedpostComponent', () => {
  let component: RelatedpostComponent;
  let fixture: ComponentFixture<RelatedpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedpostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
