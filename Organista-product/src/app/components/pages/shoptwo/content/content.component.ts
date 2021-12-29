import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import shoppost from '../../../../data/shop.json';
import { ApiService } from 'src/app/api.service';
import { Category } from 'src/app/components/models/category';
import { Product } from 'src/app/components/models/product';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { contains } from 'jquery';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  // pagination
  page: number = 1;
  closeResult: string;
  modalContent: any;
  categories: any;
  storeID: any;
  catId: any;
  sortBy: any = 0;
  selectedMenu: any;
  categoryId: any;
  page_no: number = 0;
  catalogueList: [];
  product: any;
  currentPage: any;
  currentPageElement: any;
  isLastPage: any;
  isFirstPage: any;
  previousPage: number;
  nextPage: any;
  fakeArray: any[];
  paginationArr: any[];
  singleInventoriesMode: any;
  minVal: any;
  clusterPriceArr: any[];
  allProductInventory: any;
  priceObj: any;
  catID: any;
  storeName: any;
  constructor(
    private modalService: NgbModal,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private platformLocation: PlatformLocation) {
      this.storeID = "McD";
     }
  open(content: any, item: any) {
    this.modalContent = item
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'andro_quick-view-modal p-0' });
  }
  // Increment decrement
  public counter: number = 1
  increment() {
    this.counter += 1;
  }
  decrement() {
    this.counter -= 1;
  }
  public shopbox: { img: string }[] = shoppost;

  //categories
  getCategory(){
    this.apiService.getCategoryByStoreID(this.storeID).subscribe((res: any) => {
        console.log('category obj: ', res)
        if (res.message){
            if(res.data.content.length > 1){
                this.categories = res.data.content;
            }else{
                this.categories = res.data.content;
            }
            //console.log('newCategories getCategory: ', this.categories);
        }else{
        }
    }, error => {
        console.log(error)
    }) 
}
getAllProduct(){
  this.catId = null
  this.sortBy = null
  this.getProduct(this.catId ,this.sortBy)
}

goToDetails(prodName){
  // alert(prodName)
  // return false;
  this.route.navigate(['shop-v2/' + prodName]);
  // alert('Hello')
}
getProduct(catId: any, sortBy: any) {
    if(!catId && !sortBy){
      this.selectedMenu = 'all';
    }else{
      this.selectedMenu = catId;
    }
    console.log("Selected Menu", this.selectedMenu)
    this.categoryId = catId;
    localStorage.setItem('category_id', this.catId)
    this.catalogueList = []
    this.apiService.getProductSByCategory(catId,this.storeID,sortBy,this.page_no).subscribe((res: any) => {
      if(res.message){
        this.product = res.data.content;
        let productPagination = res.data;
        let totalPages = productPagination.totalPages;
        this.currentPage = productPagination.pageable.pageNumber + 1;
        this.currentPageElement = productPagination.pageable.pageNumber;
        this.isLastPage = productPagination.last;
        this.isFirstPage = productPagination.first;
        if(this.isFirstPage === false){
          this.previousPage = this.currentPage - 1;
        }else{

        }
        if(this.isLastPage === false){
          this.nextPage = this.currentPage + 1;
        }else{

        }
        console.log('Current Page: ' + this.currentPage)
        console.log('Previous Page: ' + this.previousPage)
        console.log('Next Page: ' + this.nextPage)

        this.fakeArray = new Array(totalPages);
        this.paginationArr = [];
        if(this.currentPage){
          this.paginationArr.push(this.currentPage)
        }
        if(this.previousPage){
          this.paginationArr.push(this.previousPage)
        }
        if(this.nextPage){
          this.paginationArr.push(this.nextPage)
        }
        
        console.log('Pagination Arr[]:', this.paginationArr)
        console.log('getProduct()', this.product)
        console.log('ProducPagination: ', productPagination)
        console.log('totalPages: ', totalPages)

        let productObj = this.product;
        productObj.forEach(obj => {
          let productID = obj.id;
          let inventoryArr = obj.productInventories;

          if(inventoryArr.length !== 0){
            if(this.singleInventoriesMode){
              this.minVal = inventoryArr[0].price;
            }else{
              this.clusterPriceArr = [];
              inventoryArr.forEach(inventoryObj => {
                this.clusterPriceArr.push(inventoryObj.price);
                this.allProductInventory.push(inventoryObj);
              });
              //this.minVal = this.clusterPriceArr.reduce((a, b)=> Math.min(a, b));
              let count = false;

              inventoryArr.map(item => {
                if(item.price == this.minVal && !count){
                  count = true;
                  count = true;
                  //this.catalogueList.push(item)
                  console.log('catalogueList: ', this.catalogueList)
              }
          })
    }
  }else{
      this.minVal = 0;
  }
  // creating an object of a specific product item 
  let data = {
      product_id : productID,
      minPrice : this.minVal
  }

  // populate product id as identifier of item and its min price into a new final object collection 
  this.priceObj.push(data);
  });

  console.log('initial catalogue product: ', this.catalogueList)
  console.log('all product inventories: ', this.allProductInventory)
  } else {
  // condition if required for different type of response message 
  }
  }, error => {
  console.log(error)
  })    
  }
  sortByValue(){
    this.getProduct(this.catId ,this.sortBy)
}

  ngOnInit() {
    //console.log("asdghasadasd",this.route.getCurrentNavigation());
    //console.log("asdghas",this.route.getCurrentNavigation().extras.state.catId);
    this.catId = localStorage.getItem("category_id")
    console.log('Catalogue on Page Load');
    if(!this.storeID){
      this.getMerchantInfo(this.storeName)
    }else{
      this.skipMerchantInfo()
    }
    this.getAllProduct();
    this.getProduct;
    
  }
  skipMerchantInfo() {
    this.getProduct(this.catId , this.sortBy);
    this.getCategory();
  }
  getMerchantInfo(storeName) {
    this.apiService.getStoreInfo(storeName).subscribe((res: any) => {
      let data = res.data.content[0]
      let exist = data.length
      if(res.message){
        if(exist === 0){
          return false
        }

        this.storeID = data.id;
        this.getProduct(this.catId, this.sortBy);
        this.getCategory();
        console.log('id: ' + this.storeID)
      }else{

      }
    })
  }

}
