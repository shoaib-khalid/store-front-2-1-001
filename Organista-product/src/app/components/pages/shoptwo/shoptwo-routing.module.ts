import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoptwoComponent } from './shoptwo.component';

const routes: Routes = [{ path: '', component: ShoptwoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoptwoRoutingModule { }
