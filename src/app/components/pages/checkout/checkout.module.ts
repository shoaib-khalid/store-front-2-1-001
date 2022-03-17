// import { NgModule } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';



@NgModule({
  declarations: [CheckoutComponent, ContentComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule
    
  ]
})
export class CheckoutModule { }
