import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import cartList from '../../../data/cart.json';
import { ApiService } from 'src/app/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../models/cart';
import { CartService } from 'src/app/cart.service';

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
  storeID: any;
  storeName: String = 'McD';
  has_storeId: boolean = false;
  assets = {};
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
    private platformLocation: PlatformLocation,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private cartService: CartService
  ) {
    this.storeID = "McD";
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
    console.log('StoreID: ' + this.storeID)
    const assetData = await this.getAssets(this.storeID)
    this.assets = assetData
    if (this.assets['logoUrl'] != null) {
      this.logoExist = true;
    }
  }
  getMerchantInfo(storename) {
    return new Promise(resolve => {
      this.apiService.getStoreInfo(storename).subscribe((res: any) => {
        resolve(res.data)
      }), error => {
        console.log('error store')
      }
    })
  }

  getAssets(storeID) {
    return new Promise(resolve => {
      // check count Item in Cart 
      this.apiService.getStoreAssets(storeID).subscribe((res: any) => {
        resolve(res.data)
      }, error => {
        // Swals.fire("Oops...", "Error : <small style='color: red; font-style: italic;'>" + error.error.message + "</small>", "error")
      })
    });
  }
}
