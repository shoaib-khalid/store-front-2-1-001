// import { NgModule } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'
import { FormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ChooseDeliveryAddressComponent } from './choose-delivery-address/choose-delivery-address.component';


@NgModule({
  declarations: [CheckoutComponent, ContentComponent, ChooseDeliveryAddressComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    MatIconModule, 
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatRadioModule,
    MatCheckboxModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyCFhf1LxbPWNQSDmxpfQlx69agW-I-xBIw',
    //   libraries: ['places']
    // })
  ],
  entryComponents: [ChooseDeliveryAddressComponent]
})
export class CheckoutModule { }
