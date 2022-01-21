import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { ShoponeRoutingModule } from './shopone-routing.module';
import { ShoponeComponent } from './shopone.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [ShoponeComponent, ContentComponent],
  imports: [
    CommonModule,
    ShoponeRoutingModule,
    NgbModule,
    NgxPaginationModule,
    SharedModule
  ]
})
export class ShoponeModule { }
