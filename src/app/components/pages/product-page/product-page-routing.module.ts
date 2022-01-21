import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductpageComponent } from './product-page.component';

const routes: Routes = [{ path: '', component: ProductpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductpageRoutingModule { }
