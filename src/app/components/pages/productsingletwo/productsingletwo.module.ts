import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { ProductsingletwoRoutingModule } from './productsingletwo-routing.module';
import { ProductsingletwoComponent } from './productsingletwo.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [ProductsingletwoComponent, ContentComponent],
  imports: [
    CommonModule,
    NgbModule,
    HttpClientModule,
    ProductsingletwoRoutingModule,
    SharedModule
  ]
})
export class ProductsingletwoModule { }
