import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT, PlatformLocation } from '@angular/common';
import cartList from '../../../data/cart.json';
import { ApiService } from 'src/app/api.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../models/cart';
import { CartService } from 'src/app/cart.service';
import { StoreService } from 'src/app/store.service';
import { StoreAsset } from '../../models/store';

@Component({
  selector: 'app-headerthree',
  templateUrl: './headerthree.component.html',
  styleUrls: ['./headerthree.component.css']
})
export class HeaderthreeComponent implements OnInit {
  [x: string]: any;
  currBaseURL: any;
  localURL: any;
  senderID: any;
  storeName: String = 'McD';
  assets: StoreAsset;
  bannerExist: boolean = false;
  logoExist: boolean = false;
  storeDescription: any;
  storeDiscount: any = {};
  salesDiscount: any = {};
  deliveryDiscount: any = {};
  is_sales: boolean = true;
  is_delivery: boolean = false;
  vertical: any;
  hasBanner: any;
  isFnb: boolean = false;
  isEcomm: boolean = false;
  currencySymbol: string = "";
  storeNameRaw: any;

  constructor(@Inject(DOCUMENT) private document: Document,
    private apiService: ApiService,
    private cartService: CartService,
    private storeService: StoreService
  ) {
    this.assets = {
      storeId: '',
      bannerUrl: '',
      bannerMobileUrl: '',
      logoUrl: '',
      qrCodeUrl: ''
    }

    this.cart = cartService.cart;
    cartService.cartChange.subscribe(cart => { this.cart = cart; });
  }

  // Sticky Nav
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    //set up the div "id=nav"
    if (document.body.scrollTop > 150 ||
      document.documentElement.scrollTop > 150) {
      document.getElementById('can-sticky').classList.add('sticky');
    }
    else {
      document.getElementById('can-sticky').classList.remove('sticky');
    }
  }
  // navigation
  navmethod: boolean = true;
  toggleNav() {
    this.navmethod = !this.navmethod;
  }
  // Sidebar Category
  categorymethod: boolean = true;
  categoryToggle() {
    this.categorymethod = !this.categorymethod;
  }
  // Canvas Sidebar
  sidebarmethod: boolean = true;
  sidebarToggle() {
    this.sidebarmethod = !this.sidebarmethod;
  }
  // Cart
  public cart: CartItem[];
  public calculateprice() {
    return this.cart.reduce((subtotal: number, item: CartItem) => subtotal + item.price, 0);
  };
  async ngOnInit() {
    this.assets = await this.storeService.getAssets();
    if (this.assets.logoUrl != null) {
      this.logoExist = true;
    }
  }
}
