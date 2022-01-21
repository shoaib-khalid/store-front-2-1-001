import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopfourComponent } from './shopfour.component';

const routes: Routes = [{ path: '', component: ShopfourComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopfourRoutingModule { }
