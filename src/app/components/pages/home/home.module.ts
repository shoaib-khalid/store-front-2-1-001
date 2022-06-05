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
import { PreloaderComponent } from '../../../preloader/preloader.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [HomeComponent, ContentComponent, PreloaderComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SlickCarouselModule,
    NgbModule,
    CountdownModule,
    SharedModule,
    NgMasonryGridModule,
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    
  ]
})
export class HomeModule { }
