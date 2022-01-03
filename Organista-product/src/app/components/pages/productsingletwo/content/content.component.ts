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
  itemWithinProduct:any;
  requestParamVariant:any = [];
  requestParamVariantNew:any = [];
  variantOfSelected: any;
  productPrice:any = 0;
  productItemCode: any;
  storeID:any;
  storeDeliveryPercentage:any;
  inputQty:any;
  product:Product;
   //product: Product = new Product;
  currentVariant: any[];
  productSku: any;
  imageCollection: any;
  galleryImages: any;
  productID: any;
  seo_name: any;
  seoName: string;

  constructor(private router: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
        private route: Router,
        private apiService: ApiService,
        private platformLocation: PlatformLocation) { 
          //console.log("router value",this.activatedRoute.snapshot.paramMap.get('productID'));
          this.storeID = "McD";
          //this.productID = this.route.routerState.snapshot.url..get('id');//"2710969f-6cbf-4058-87db-c829bb4012d1"
          //this.seoName = "4-Piece-Chicken-McNuggets®-Happy-Meal"
          this.activatedRoute.params.subscribe(params => {
            this.seoName = params['prodSeoName'];
            this.storeName = (params['storeName']) ? params['storeName'] : this.storeName;
            console.log('product name before: ' + this.seoName); // Print the parameter to the console.             
        });
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
    this.counter -= 1;
  }
  getProductDetailsByName(seoName, storeID){
    console.log('getProductDetailsByName(): ' + seoName)
    return new Promise( resolve => {        
        this.apiService.getProductByName(seoName, storeID).subscribe((res: any) => {
            if (res.message){
                // resolve(res.data.content[0])
                resolve(res.data.content)
                console.log('From Name: ' , res.data.content)
                this.product = res.data.content;
            } 
        },) 
    })
  }
  // getProductByID(){
  //   //const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
  //   return new Promise( resolve => {
  //       this.apiService.getProductByProductID(this.productID).subscribe((res: any) => {
  //           if (res.message){
  //               resolve(res.data)
  //               console.log('Product Data: ' , res.data)
  //               this.product = res.data;
  //           } 
  //       },) 
  //   })
  // }
   async getVariantFlow(){
    
    const prodName = await this.getProductDetailsByName(this.seoName, this.storeID)

 }

  async ngOnInit() {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   let productid = params['productid'];
    //   console.log(productid);
    // this.activatedRoute.queryParams.subscribe(param => {
    //   let productId = param['productID'];
    //   console.log(this.productID);
    // })
    //this.getProductByID();
    await this.getVariantFlow();
  //   this.activatedRoute.paramMap.subscribe(paramMap => {
  //     let productID = paramMap.get('productID'); // id gets updated whenever parameters change
  //     console.log("router value",productID);
  //     // add or call any code that needs to re-run when a parameter changes here
  // });
  
    // this.setProduct(this.router.snapshot.params.id);
    // await this.getVariantFlow();
    //console.log('Product' , this.product)
    
  }

}
