import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsingletwoComponent } from './productsingletwo.component';

const routes: Routes = [{ path: '', component: ProductsingletwoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsingletwoRoutingModule { }
