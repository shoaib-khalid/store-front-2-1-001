import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BreadcrumbModule } from "angular-crumbs";
import { SlickCarouselModule } from "ngx-slick-carousel";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NewsletterComponent } from "./newsletter/newsletter.component";

import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "./components/shared/shared.module";
import { Ng2SearchPipeModule } from "ng2-search-filter";

import { APP_INITIALIZER } from "@angular/core";
import { AppConfig } from "./app.config";


export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [AppComponent, NewsletterComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BreadcrumbModule,
    NgbModule,
    SlickCarouselModule,
    HttpClientModule,
    SharedModule,
    Ng2SearchPipeModule,
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
