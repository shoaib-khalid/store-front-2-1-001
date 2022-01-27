import { Component, AfterContentInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import shoppost from '../../../../data/shop.json';
import blogcategory from '../../../../data/blogcategory.json';
import blogtags from '../../../../data/blogtags.json';
import { ApiService } from 'src/app/api.service';
import { Category } from 'src/app/components/models/category';
import { PlatformLocation, Location } from '@angular/common';
import { Product } from 'src/app/components/models/product';
import { contains, data, param } from 'jquery';
import { HttpParams } from '@angular/common/http';
import { CartService } from 'src/app/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  productId: any;
  productSeoName: any;
  detailsObj: any = {};
  productAssets: any;
  storeName: any;
  //product: any[] = [];
  itemWithinProduct: any;
  requestParamVariant: any = [];
  requestParamVariantNew: any = [];
  variantOfSelected: any;
  productPrice: any = 0;
  productItemCode: any;
  storeID: any;
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
  seoName: string;

  constructor(private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public cartService: CartService,
    private platformLocation: PlatformLocation,
    private location: Location) {
    this.storeID = "McD";
    this.product = {
      allowOutOfStockPurchases: false,
      categoryId: '',
      productid: 0,
      name: '',
      description: '',
      price: 0,
      thumbnailUrl: '',
      status: false,
      id: '',
      productInventories: [
        {
          itemCode: '',
          price: 0,
          quantity: 0,
          productId: '',
          sku: '',
          productInventoryItems: [],
          product: null,
        }
      ]
    };
    this.activatedRoute.params.subscribe(params => {
      this.seoName = params['prodSeoName'];
      this.storeName = (params['storeName']) ? params['storeName'] : this.storeName;
      console.log('product name before: ' + this.seoName); // Print the parameter to the console.             
    });

  }

  // Increment decrement
  public counter: number = 1
  increment() {
    this.counter += 1;
  }
  decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }
  // goBack(): void {
  //   this.location.back();
  // }
  getProductDetailsByName(seoName, storeID) {
    console.log('getProductDetailsByName(): ' + seoName)

    this.apiService.getProductsByName(seoName, storeID).subscribe((res: any) => {
      this.product = res.data.content[0];
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    });   
  }
  async getVariantFlow() {

    const prodName = await this.getProductDetailsByName(this.seoName, this.storeID)
    //  const prodId = await this.getProductByID(this.productID)
  }

  async ngOnInit() {
    this.getProductDetailsByName(this.seoName, this.storeID);
  }

  async addToCart() {
    console.log(this.product);
    const addToCartResponse: any = await this.cartService.addToCart(this.product, this.counter);
    if (addToCartResponse.status === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Great!',
        text: 'Item successfully added to cart.',
        confirmButtonColor: '#50BD4D'
      })
    } else {
      // TODO: Show error message
    }
    this.router.navigate(['/cart']);
  }
}
