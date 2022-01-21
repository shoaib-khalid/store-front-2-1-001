import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'angular-crumbs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CountdownModule } from 'ngx-countdown';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { BlogsidebarComponent } from './blogsidebar/blogsidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { CanvasComponent } from './canvas/canvas.component';
import { CategoryComponent } from './category/category.component';
import { DealsliderComponent } from './dealslider/dealslider.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HeadertwoComponent } from './headertwo/headertwo.component';
import { HeaderthreeComponent } from './headerthree/headerthree.component';
import { InstagramComponent } from './instagram/instagram.component';
import { MobilemenuComponent } from './mobilemenu/mobilemenu.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RelatedpostComponent } from './relatedpost/relatedpost.component';
import { RelatedproductComponent } from './relatedproduct/relatedproduct.component';
import { ShopsidebarComponent } from './shopsidebar/shopsidebar.component';



@NgModule({
  declarations: [BlogsidebarComponent, BreadcrumbsComponent, CanvasComponent, CategoryComponent, DealsliderComponent, FooterComponent, HeaderComponent, HeadertwoComponent, HeaderthreeComponent, InstagramComponent, MobilemenuComponent, NavigationComponent, RelatedpostComponent, RelatedproductComponent, ShopsidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    SlickCarouselModule,
    NgbModule,
    CountdownModule,
    BreadcrumbModule,
    IonRangeSliderModule
  ],
  exports: [BlogsidebarComponent, BreadcrumbsComponent, CanvasComponent, CategoryComponent, DealsliderComponent, FooterComponent, HeaderComponent, HeadertwoComponent, HeaderthreeComponent, InstagramComponent, MobilemenuComponent, NavigationComponent, RelatedpostComponent, RelatedproductComponent, ShopsidebarComponent]
})
export class SharedModule { }
