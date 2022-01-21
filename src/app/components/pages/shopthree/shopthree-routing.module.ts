import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopthreeComponent } from './shopthree.component';

const routes: Routes = [{ path: '', component: ShopthreeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopthreeRoutingModule { }
