import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CountdownModule } from 'ngx-countdown';
import { NgMasonryGridModule } from 'ng-masonry-grid';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'
import { PreloaderComponent } from 'src/app/preloader/preloader.component';

@NgModule({
  declarations: [HomeComponent, ContentComponent, PreloaderComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SlickCarouselModule,
    NgbModule,
    CountdownModule,
    SharedModule,
    NgMasonryGridModule
  ]
})
export class HomeModule { }
