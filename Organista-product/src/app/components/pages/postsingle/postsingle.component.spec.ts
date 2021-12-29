import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsingleComponent } from './postsingle.component';

describe('PostsingleComponent', () => {
  let component: PostsingleComponent;
  let fixture: ComponentFixture<PostsingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
