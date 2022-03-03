import { Component, OnInit, HostListener, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
// import { ApiService } from 'src/app/api.service';
import { CartItem } from "../../models/cart";
// import { CartService } from 'src/app/cart.service';
// import { StoreService } from 'src/app/store.service';
import { Store, StoreAssets } from "../../models/store";
import { ApiService } from "../../../api.service";
import { CartService } from "../../../cart.service";
import { StoreService } from "../../../store.service";

@Component({
  selector: "app-headerthree",
  templateUrl: "./headerthree.component.html",
  styleUrls: ["./headerthree.component.css"],
})
export class HeaderthreeComponent implements OnInit {
  [x: string]: any;
  currBaseURL: any;
  localURL: any;
  senderID: any;
  storeName: String = "McD";
  assets: StoreAssets[];
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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private apiService: ApiService,
    private cartService: CartService,
    private storeService: StoreService
  ) {
    // this.assets = {
    //   storeId: '',
    //   bannerUrl: '',
    //   bannerMobileUrl: '',
    //   logoUrl: '',
    //   qrCodeUrl: ''
    // }

    this.cart = cartService.cart;
    cartService.cartChange.subscribe((cart) => {
      this.cart = cart;
    });
  }
  getStoreHour(){
    console.log('hello')
        this.apiService.getStoreHoursByID(this.storeID).subscribe((res: any) => {
            console.log('store business hour: ', res)
            if (res.message){
                console.log('storeTiming : ', res.data.storeTiming)
                
                this.currencySymbol =  res.data.regionCountry.currencySymbol;

                console.log('symbol currency: ', this.currencySymbol)

                const currentDate = new Date();

                var todayDay = this.dayArr[currentDate.getDay()];

                var browserTime = new Date();

                this.storeTimingObj = res.data.storeTiming;

                this.storeTimingObj.forEach( obj => {

                    let dayObj = obj.day;

                    if(dayObj == todayDay){
                        // true = store closed ; false = store opened
                        let isOff = obj.isOff;

                        if (isOff == false) {
                            var openTime = new Date();
                            openTime.setHours(obj.openTime.split(":")[0], obj.openTime.split(":")[1], 0); 
                            var closeTime = new Date();
                            closeTime.setHours(obj.closeTime.split(":")[0], obj.closeTime.split(":")[1], 0); 

                            console.log("happy hour?")
                            if(browserTime >= openTime && browserTime < closeTime ){
                                console.log("WE ARE OPEN !");
                            }else{
                                console.log("OH No, sorry! between 5.30pm and 6.30pm");
                                this.store_close = false
                            }

                        } else {
                            console.log("WERE ARE CLOSED")
                            this.store_close = false
                        }
                    }
                });

            } else {
            }
        }, error => {
            console.log(error)
        }) 
    }
  async populateAssets() {
    const store: Store = await this.storeService.getStoreInfo();
    for (let storeAsset of store.storeAssets) {
      if (storeAsset.assetType === "LogoUrl") {
        this.logoUrl = storeAsset.assetUrl;
      }
    }
  }
  async getStoreInfo() {
    try {
      const storeInfo: Store = await this.storeService.getStoreInfo();
      this.currencySymbol = storeInfo.regionCountry.currencySymbol;
    } catch (error) {
      console.error("Error getting storeInfo", error);
    }
  }

  // Sticky Nav
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(event: Event) {
    //set up the div "id=nav"
    if (
      document.body.scrollTop > 150 ||
      document.documentElement.scrollTop > 150
    ) {
      document.getElementById("can-sticky").classList.add("sticky");
    } else {
      document.getElementById("can-sticky").classList.remove("sticky");
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
    return this.cart.reduce(
      (subtotal: number, item: CartItem) => subtotal + item.price,
      0
    );
  }
  async ngOnInit() {
    this.getStoreHour();
    this.populateAssets();
    this.getStoreInfo();
  }
}
