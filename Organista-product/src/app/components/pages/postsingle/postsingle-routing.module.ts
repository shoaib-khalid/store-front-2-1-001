import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostsingleComponent } from './postsingle.component';

const routes: Routes = [{ path: '', component: PostsingleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsingleRoutingModule { }
