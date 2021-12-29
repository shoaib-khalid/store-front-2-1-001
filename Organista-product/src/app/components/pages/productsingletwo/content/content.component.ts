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

  constructor(private router: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
        private route: Router,
        private apiService: ApiService,
        private platformLocation: PlatformLocation) { 
          this.storeID = "McD";
          //this.productID = "2710969f-6cbf-4058-87db-c829bb4012d1"
          this.activatedRoute.params.subscribe(params => {
            this.productSeoName = params['prodSeoName'];
            this.storeName = (params['storeName']) ? params['storeName'] : this.storeName;
            console.log('product name before: ' + this.productSeoName); // Print the parameter to the console.             
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
  getProductDetailsByName(seo_name, store_id){
    console.log('getProductDetailsByName(): ' + seo_name)
    return new Promise( resolve => {        
        this.apiService.getProductByName(seo_name, store_id).subscribe((res: any) => {
            if (res.message){
                // resolve(res.data.content[0])
                resolve(res.data.content)
                
            } 
        },) 
    })
  }
  getProductByID(){
    return new Promise( resolve => {
        this.apiService.getProductByProductID(this.productID).subscribe((res: any) => {
            if (res.message){
                resolve(res.data)
                console.log('Product Data: ' , res.data)
                this.product = res.data;
            } 
        },) 
    })
  }
//   async getVariantFlow(){
    
//     const prodName = await this.getProductDetailsByName(this.productSeoName, this.storeID)

//         console.log('promised prodName details: ', prodName)
//         //this.productID = '79016a37-5d19-41bc-80de-5c49bdf3304a'
//         //this.productID = prodName[0]['id']
//         this.detailsObj = prodName[0]
//         this.product = prodName[0]

//         this.productAssets = this.detailsObj.productAssets;
        
//        console.log("detailsObj: "+ prodName[0]['description']);
//        console.log("this.productAssets: ", this.productAssets);
        
//         // Variant logic

//         this.itemWithinProduct = this.detailsObj.productInventories

//         console.log('item within product: ', this.itemWithinProduct)

//         this.currentVariant = []

//         // let variantOfSelected = this.selectedProduct.productInventoryItems
//         let minimum_item = this.itemWithinProduct.reduce((r, e) => r.price < e.price ? r : e);
//         console.log('minimum item: ', minimum_item)

//         this.variantOfSelected = minimum_item.productInventoryItems
//         this.productPrice = minimum_item.price;
//         this.productItemCode = minimum_item.itemCode;
//         this.productSku = minimum_item.sku;


//         this.variantOfSelected.forEach(variants => {

//             console.log('selected item variant id: ', variants.productVariantAvailableId)

//             this.currentVariant.push(variants.productVariantAvailableId)
//         });

//         console.log('current variant obj:', this.currentVariant)
//         // end of redundant code activity 

//         // image collection logic 

//         this.productAssets.forEach( obj => {
//             // console.log('productAssets: ', obj.url);

//             let img_obj = {
//                 small: ''+obj.url+'',
//                 medium: ''+obj.url+'',
//                 big: ''+obj.url+''
//             }

//             console.log(obj.itemCode + " |||| " + this.productItemCode)
//             if(obj.itemCode != this.productItemCode){
//                 this.imageCollection.push(img_obj)
//             }
            
//         });

//         this.productAssets.forEach( obj => {
//             // console.log('productAssets: ', obj.url);
//             let img_obj = {
//                 small: ''+obj.url+'',
//                 medium: ''+obj.url+'',
//                 big: ''+obj.url+''
//             }
            
//             if(obj.itemCode == this.productItemCode){
//                 this.imageCollection.unshift(img_obj)
//             }
            
//         });

//         console.log('imageCollection: ', this.imageCollection);
//         this.galleryImages = this.imageCollection

//         //logic to extract current selected variant and to reconstruct new object with its string identifier 
//         let allVariantObjBase = this.detailsObj.productVariants

//         console.log('allVariantObjBase: ' , allVariantObjBase)

//         allVariantObjBase.map(variantBase => {

//             console.log(variantBase)

//             let productVariantsAvailable = variantBase.productVariantsAvailable
            
//             productVariantsAvailable.forEach(element => {
//                 console.log('element: ' + element.id + " basename: " + variantBase.name)

//                 this.currentVariant.map(currentVariant => {
//                     console.log('currentVariant: ', currentVariant)

//                     if(currentVariant.indexOf(element.id) > -1){
//                         console.log(element.id + ' exist in array')

//                         let data = {
//                             basename: variantBase.name,
//                             variantID: element.id,
//                         }

//                         this.requestParamVariant.push(data)
//                     }
//                 })

//             })

//         })

//         console.log('requestParamVariant: ' , this.requestParamVariant)
//   }
//   onChangeVariant(id, type, productID){
//     this.requestParamVariant.map( variant => {
//         if(variant.basename == type && variant.variantID != id){

//             console.log(variant.variantID + ' (' + type + ') has been replaced with ' + id + '(' + type + ')')

//             this.requestParamVariant.find( oldVariant => oldVariant.basename === type).variantID = id
//         }
        
//     })

//     this.requestParamVariantNew = []        

//     this.requestParamVariant.forEach(el => {

//         this.requestParamVariantNew.push(el.variantID)
        
//     });

//     console.log('updated request param: ', this.requestParamVariantNew)

//     this.findInventory(productID)
// }
//   findInventory(productID) {
//     var toFind = this.requestParamVariantNew

//     console.log('test: ', productID)
//     var productArr = this.detailsObj

//     console.log('product: ', productArr)

//     var inventories = productArr.productInventories

//     var assetsArr = productArr.productAssets

//     console.log('inventories: ', inventories)
//     var flag = true;
//     var selectedItem;

//     var productInventoryItems;
    
//     for (let i = 0; i < inventories.length; i++) {
//         flag=true;
//         selectedItem = inventories[i]

//         productInventoryItems = inventories[i]['productInventoryItems']

//         for (let j = 0; j < productInventoryItems.length; j++) {
//             if(toFind.includes(productInventoryItems[j].productVariantAvailableId)){
//                 continue;
//             }else{
//                 flag=false;
//                 break;
//             }
//         }

//         if(flag){
//             console.log('selected item: ', selectedItem)

//             this.productPrice = selectedItem.price
//             this.productItemCode = selectedItem.itemCode
//             this.productSku = selectedItem.sku

//             // reorder image collection 

//             this.galleryImages = [];
//             this.imageCollection = [];

//             this.productAssets = assetsArr;

//             // rearrange imageCollection 
//             this.productAssets.forEach( obj => {
//                 // console.log('productAssets: ', obj.url);
//                 let img_obj = {
//                     small: ''+obj.url+'',
//                     medium: ''+obj.url+'',
//                     big: ''+obj.url+''
//                 }
                
//                 if(obj.itemCode != this.productItemCode){
//                     this.imageCollection.push(img_obj)
//                 }
                
//             });

//             this.productAssets.forEach( obj => {
//                 // console.log('productAssets: ', obj.url);
//                 let img_obj = {
//                     small: ''+obj.url+'',
//                     medium: ''+obj.url+'',
//                     big: ''+obj.url+''
//                 }
                
//                 if(obj.itemCode == this.productItemCode){
//                     this.imageCollection.unshift(img_obj)
//                 }
                
//             });


//             console.log('new imageCollection: ', this.imageCollection);
            
//             this.galleryImages = this.imageCollection
//             // end of reorder image collection

//             console.log('popup details: ' + this.productPrice + " | " + this.productItemCode + " | " + this.productSku)
//         }
        
//     }
// }

  ngOnInit() {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   let productid = params['productid'];
    //   console.log(productid);
    // this.activatedRoute.queryParams.subscribe(param => {
    //   let productId = param['productID'];
    //   console.log(this.productID);
    // })
    this.getProductByID();
     this.getProductDetailsByName;
    // this.setProduct(this.router.snapshot.params.id);
    // await this.getVariantFlow();
    //console.log('Product' , this.product)
    
  }

}
