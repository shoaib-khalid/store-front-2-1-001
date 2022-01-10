import { Component, AfterContentInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import shoppost from '../../../../data/shop.json';
import blogcategory from '../../../../data/blogcategory.json';
import blogtags from '../../../../data/blogtags.json';
import { ApiService } from 'src/app/api.service';
import { Category } from 'src/app/components/models/category';
import { PlatformLocation } from '@angular/common';
import { Product } from 'src/app/components/models/product';
import { contains, data, param } from 'jquery';
import { HttpParams } from '@angular/common/http';
import { CartService } from 'src/app/cart.service';

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
    private cartService: CartService,
    private platformLocation: PlatformLocation) {
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
    // this.activatedRoute.params.subscribe(params => {
    //   this.productID = params['id'];
    //   this.storeName = (params['storeName']) ? params['storeName'] : this.storeName;
    //   console.log('product name before: ' + this.productID); // Print the parameter to the console.             
    // });
  }
  // public Product: { name: string, productID: number }[] = shoppost;
  // //public tags: { title: string, id: number }[] = blogtags;
  // //public category: { title: string, id: number }[] = blogcategory;

  // public setProduct(id: any) {
  //   this.product = shoppost.filter((item: { id: any; }) => { return data == id });
  // }
  // public getBlogTags(items: string | any[]) {
  //   var elems = blogtags.filter((item: { id: string; }) => {
  //     return items.includes(item.id)
  //   });
  //   return elems;
  // }
  // public getBlogCategory(items: string | any[]) {
  //   var elems = blogcategory.filter((item: { id: string; }) => {
  //     return items.includes(item.id)
  //   });
  //   return elems;
  // }
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
  getProductDetailsByName(seoName, storeID) {
    console.log('getProductDetailsByName(): ' + seoName)

    this.apiService.getProductsByName(seoName, storeID).subscribe((res: any) => {
      this.product = res.data.content[0];
    }, error => {
      console.error(error);
    });
  }
  async getVariantFlow() {

    const prodName = await this.getProductDetailsByName(this.seoName, this.storeID)
    //  const prodId = await this.getProductByID(this.productID)
  }

  async ngOnInit() {
    this.getProductDetailsByName(this.seoName, this.storeID);
  }

  addToCart() {
    console.log(this.product);
    this.cartService.addToCart(this.product, this.counter);
    this.router.navigate(['/cart']);
  }
}
