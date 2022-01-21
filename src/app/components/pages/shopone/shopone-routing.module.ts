import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoponeComponent } from './shopone.component';

const routes: Routes = [{ path: '', component: ShoponeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoponeRoutingModule { }
