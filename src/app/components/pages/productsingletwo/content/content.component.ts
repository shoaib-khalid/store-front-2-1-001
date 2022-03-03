import { Component, AfterContentInit, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../../api.service";
import { Category } from "../../../models/category";
import { PlatformLocation, Location } from "@angular/common";
import { Product } from "../../../models/product";
import { contains, data, param } from "jquery";
import { HttpParams } from "@angular/common/http";
import { CartService } from "../../../../cart.service";
import { StoreService } from "../../../../store.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"],
})
export class ContentComponent implements OnInit {
  productId: any;
  detailsObj: any = {};
  productAssets: any;
  //product: any[] = [];
  itemWithinProduct: any;
  requestParamVariant: any = [];
  requestParamVariantNew: any = [];
  variantOfSelected: any;
  productPrice: any = 0;
  productItemCode: any;
  storeDeliveryPercentage: any;
  inputQty: any;
  product: Product;
  //product: Product = new Product;
  currentVariant: any[];
  productSku: any;
  imageCollection: any;
  galleryImages: any;
  productID: any;
  seo_name: any;
  productSeoName: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private storeService: StoreService,
    private location: Location
  ) {
    this.product = {
      allowOutOfStockPurchases: false,
      categoryId: "",
      productid: 0,
      name: "",
      description: "",
      price: 0,
      thumbnailUrl: "",
      status: false,
      id: "",
      productInventories: [
        // {
        //   itemDiscount: [{}]
        // }
        // {
        //   itemCode: "",
        //   price: 0,
        //   quantity: 0,
        //   productId: "",
        //   sku: "",
        //   productInventoryItems: [],
        //   product: null,
        // },
      ],
    };
    this.activatedRoute.params.subscribe((params) => {
      this.productSeoName = params["prodSeoName"];
    });
  }

  back(): void {
    this.location.back();
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

  async getProductDetailsByName(seoName) {
    this.product = await this.storeService.getProductDetailsByName(seoName);
  }

  ngOnInit() {
    this.getProductDetailsByName(this.productSeoName);
  }

  async addToCart() {
    const addToCartResponse: any = await this.cartService.addToCart(
      this.product,
      this.counter
    );
    if (addToCartResponse.status === 201) {
      Swal.fire({
        icon: "success",
        title: "Great!",
        text: "Item successfully added to cart.",
        confirmButtonColor: "#50BD4D",
      });
    } else {
      // TODO: Show error message
    }
    this.router.navigate(["/cart"]);
  }
}
