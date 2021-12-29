import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { HometwoRoutingModule } from './hometwo-routing.module';
import { HometwoComponent } from './hometwo.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [HometwoComponent, ContentComponent],
  imports: [
    CommonModule,
    HometwoRoutingModule,
    SlickCarouselModule,
    NgbModule,
    SharedModule
  ]
})
export class HometwoModule { }
