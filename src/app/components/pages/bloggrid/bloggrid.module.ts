import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { BloggridRoutingModule } from './bloggrid-routing.module';
import { BloggridComponent } from './bloggrid.component';

import { SharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content/content.component'

@NgModule({
  declarations: [BloggridComponent, ContentComponent],
  imports: [
    CommonModule,
    BloggridRoutingModule,
    NgbModule,
    NgxPaginationModule,
    SharedModule,
  ]
})
export class BloggridModule { }
