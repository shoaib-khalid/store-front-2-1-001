import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [CartComponent, ContentComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    NgbModule,
    SlickCarouselModule,
    SharedModule
  ]
})
export class CartModule { }
