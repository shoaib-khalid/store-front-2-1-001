import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { WishlistRoutingModule } from './wishlist-routing.module';
import { WishlistComponent } from './wishlist.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [WishlistComponent, ContentComponent],
  imports: [
    CommonModule,
    WishlistRoutingModule,
    SharedModule,
    NgbModule
  ]
})
export class WishlistModule { }
