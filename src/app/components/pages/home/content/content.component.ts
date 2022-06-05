import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { Category } from "../../../models/category";
import { Product } from "../../../models/product";
import { Store, StoreAssets, StoreDiscount } from "../../../models/store";
import { CartService } from "../../../../cart.service";
import { StoreService } from "../../../../store.service";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"],
})

// enum StoreAsset {
//   Logo = 'Logo',
//   DesktopBanner = 'DesktopBanner',
//   MobileBanner = 'MobileBanner',
//   Favicon = 'Favicon'
// }
export class ContentComponent implements OnInit {
  isLoading: boolean;

  closeResult: string;
  public categoryArray: Category[];
  modalContent: Product;
  data: any;
  product_id: any;
  productID: any;
  bannerUrl: string

  categories: Category[];
  product: Product[];
  requestParamVarianNew: any;
  detailsObj: any;
  productItemCode: any;
  productPrice: any;
  productSku: any;
  galleryImages: any[];
  imageCollection: any[];
  productAssets: any;
  requestParamVariantNew: any = [];
  popupPrice: any;
  popupItemcode: any;
  popupSKU: any;
  catalogueList: any;
  noPrice: any;
  storeAssets: StoreAssets[];
  bannerExist: boolean = false;
  assetsData: any;
  banner: any;
  storeBannerUrl = [];
  storeInfo: Store;
  currencySymbol: string = "";
  bannerslides: { photo: any; }[];
  discounts: any[] = [];
  storeDiscounts: StoreDiscount[];
  discountB: {photo: any; }[];

  constructor(
    private modalService: NgbModal,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private storeService: StoreService
  ) {
    // this.storeAssets = {
    // };
  }

  open(content: any, item: Product) {
    this.counter = 1;
    this.modalContent = item;
    this.modalService.open(content, {
      centered: true,
      size: "lg",
      windowClass: "andro_quick-view-modal p-0",
    });
  }
  closeModal() {
    this.modalService.dismissAll();
  }
  // Increment decrement
  public counter: number = 1;
  increment() {
    this.counter += 1;
  }
  decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }
  
  // Banner
  populateAssets() {
    let storeBannerUrls = [];
    for (const storeAsset of this.storeInfo.storeAssets) {
      if (storeAsset.assetType == "BannerDesktopUrl") {
        storeBannerUrls.push( { photo: storeAsset.assetUrl} );
      }
    }
    this.bannerslides = storeBannerUrls;
  }
  displayDiscountBanner() {
   for(const storeAsset of this.storeInfo.storeAssets){
     if (storeAsset.assetType === "DiscountBannerUrl"){
       this.bannerUrl = storeAsset.assetUrl
      //  discountBanner.push( { photo: storeAsset.assetUrl} )
     }
   }
}
  bannerConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: true,
  }

  goToDetails(productID) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.productID = params["productID"];
    });
    this.route.navigate(["product/:prodSeoName/"] + productID);
  }
  //Navigation to category
  goToCategory(catId) {
    this.route.navigate(["catalogue/" + catId]); // + catId
  }

  // Fresharrivals
  freshConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    autoplay: true,
    prevArrow: ".andro_fresh-arrivals .slider-prev",
    nextArrow: ".andro_fresh-arrivals .slider-next",
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  async addToCartFromModal(product: Product) {
    this.isLoading = true;
    this.modalService.dismissAll();
    const addToCartResponse: any = await this.cartService.addToCart(
      product,
      this.counter
    );
    this.isLoading = false;
    if (addToCartResponse.status === 201) {
      Swal.fire({
        icon: "success",
        title: "Item added to Cart",
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        position: "bottom-right",
      });
    } else {
      // TODO: Show Error message
    }
  }

  resolveLoading() {
    // console.log("entering WRITTING STOREASSETS");
    if (this.product && this.categories) {
      this.isLoading = false;
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
  getActiveDiscount(){
    this.storeService.getDiscount().then((response: StoreDiscount[]) =>{
      this.storeDiscounts = response;
      console.log("StoreDiscounts", response);
      if(this.storeDiscounts.length > 0){
        this.storeDiscounts.forEach(item => {
          if (item.storeDiscountTierList && item.storeDiscountTierList.length > 0 && item.discountType !== "ITEM") {
            this.discounts.push(item)
              return{
                discountName: item.discountName,
                discountType: item.discountType,
                startDate   : item.startDate,
                endDate     : item.endDate,
                maxDiscountAmount   : item.maxDiscountAmount,
                normalPriceItemOnly : item.normalPriceItemOnly,
                calculationType       : item.storeDiscountTierList[0].calculationType,
                discountAmount        : item.storeDiscountTierList[0].discountAmount,
                startTotalSalesAmount : item.storeDiscountTierList[0].startTotalSalesAmount
              }
              console.log("Pushed to discounts");
          }
          // this.discounts.push(item)
          // if(item.storeDiscountTierList &&  item.storeDiscountTierList.length > 0 && item.discountType !== "ITEM"){
          //   this.discounts.push(...item.storeDiscountTierList.map(object =>{
          //     return{
          //       discountName: item.discountName,
          //       discountType: item.discountType,
          //       startDate   : item.startDate,
          //       endDate     : item.endDate,
          //       maxDiscountAmount   : item.maxDiscountAmount,
          //       normalPriceItemOnly : item.normalPriceItemOnly,
          //       calculationType       : object.calculationType,
          //       discountAmount        : object.discountAmount,
          //       startTotalSalesAmount : object.startTotalSalesAmount
          //     }
          //   }))
          // }
        })
      }
    })
  }
  
  async ngOnInit() {
    this.isLoading = true;
    await this.storeService.parseStoreFromUrl();
    Promise.all([
      this.storeService.getStoreInfo(),
      this.storeService.getCategories(),
      this.storeService.getStoreProducts(),
      this.storeService.getDiscount(),
    ])
      .then((values) => {
        this.storeInfo = values[0];
        this.categories = values[1];
        this.product = values[2];
        //this.discounts = values [3];
        // this.isLoading = false;
        this.populateAssets();
        this.getActiveDiscount();
        this.displayDiscountBanner();
        this.getStoreInfo();
      
        this.isLoading = false;
      })
      .catch((error) => {
        console.error("Error getting values for homepage" + error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred while fetching store details. Please refresh the page.",
        });
      });
  }
}
