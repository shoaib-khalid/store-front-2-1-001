import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { ShoptwoRoutingModule } from './shoptwo-routing.module';
import { ShoptwoComponent } from './shoptwo.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [ShoptwoComponent, ContentComponent],
  imports: [
    CommonModule,
    ShoptwoRoutingModule,
    NgbModule,
    NgxPaginationModule,
    SharedModule
  ]
})
export class ShoptwoModule { }
