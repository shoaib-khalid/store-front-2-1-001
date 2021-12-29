import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { ProductpageRoutingModule } from './product-page-routing.module';
import { ProductpageComponent } from './product-page.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent} from './content/content.component'

@NgModule({
  declarations: [ProductpageComponent, ContentComponent],
  imports: [
    CommonModule,
    NgbModule,
    HttpClientModule,
    ProductpageRoutingModule,
    SharedModule
  ]
})
export class ProductpageModule { }
