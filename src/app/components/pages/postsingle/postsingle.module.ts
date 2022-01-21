import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { PostsingleRoutingModule } from './postsingle-routing.module';
import { PostsingleComponent } from './postsingle.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [PostsingleComponent, ContentComponent],
  imports: [
    CommonModule,
    NgbModule,
    HttpClientModule,
    PostsingleRoutingModule,
    SharedModule
  ]
})
export class PostsingleModule { }
