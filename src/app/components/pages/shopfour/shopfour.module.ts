import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { ShopfourRoutingModule } from './shopfour-routing.module';
import { ShopfourComponent } from './shopfour.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [ShopfourComponent, ContentComponent],
  imports: [
    CommonModule,
    ShopfourRoutingModule,
    NgbModule,
    NgxPaginationModule,
    SharedModule
  ]
})
export class ShopfourModule { }
