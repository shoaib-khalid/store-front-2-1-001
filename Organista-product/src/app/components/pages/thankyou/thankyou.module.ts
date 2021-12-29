import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThankyouRoutingModule } from './thankyou-routing.module';
import { ThankyouComponent } from './thankyou.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [ThankyouComponent, ContentComponent],
  imports: [
    CommonModule,
    ThankyouRoutingModule,
    SharedModule
  ]
})
export class ThankyouModule { }
