import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbService, Breadcrumb } from 'angular-crumbs';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CartService } from './cart.service';
import { Store } from './components/models/store';
// import { StoreService } from './store.service';
import { version } from '../../package.json';
import { StoreService } from './store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    Location, {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ]
})
export class AppComponent implements OnInit {
  title: any;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  fav: string;

  constructor(private titleService: Title,
    private breadcrumbService: BreadcrumbService,
    private cartService: CartService,
    private storeService: StoreService
  ) {

  }

  // async changeIcon() {
  //   const store : Store = await this.storeService.getStoreInfoByDomainName();
  //   for (let storeAsset of store.storeAssets) {
  //     if (storeAsset.assetType === "FaviconUrl") {
  //      this.fav = storeAsset.assetUrl;
  //     }
  //   }
  //   this.favIcon.href = this.fav;
  // }
  async changeIcon(){
    const store : Store = await this.storeService.getStoreInfo();
    for (let storeAsset of store.storeAssets){
      if(storeAsset.assetType === "FaviconUrl"){
        this.fav = storeAsset.assetUrl
      }
    }
    this.favIcon.href = this.fav;
  }

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbChanged.subscribe(async crumbs => {
      this.titleService.setTitle(await this.createTitle(crumbs));
    });
    this.changeIcon();
    console.log("Project version: " + version);
  }
  onActivate(event) {
    window.scroll(0, 0);
  }
  private async createTitle(routesCollection: Breadcrumb[]) {
    let title = 'Symplified';
    const storeInfo: Store = await this.storeService.getStoreInfo();

    title = storeInfo.name;
    console.log("RoutesCollection", routesCollection);
    const titles = routesCollection.filter((route) => route.displayName);

    if (!titles.length) { return title; }

    const routeTitle = this.titlesToString(titles);
    return `${routeTitle} ${title}`;
  }

  private titlesToString(titles) {
    return titles.reduce((prev, curr) => {
      return `${curr.displayName} - ${prev}`;
    }, '');
  }
}
