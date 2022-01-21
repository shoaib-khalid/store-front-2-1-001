import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CheckoutComponent, ContentComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule
  ]
})
export class CheckoutModule { }
