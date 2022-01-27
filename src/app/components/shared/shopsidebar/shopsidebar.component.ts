import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Category } from '../../models/category';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/store.service';

@Component({
  selector: 'app-shopsidebar',
  templateUrl: './shopsidebar.component.html',
  styleUrls: ['./shopsidebar.component.css']
})
export class ShopsidebarComponent implements OnInit {
  public categoryArray: Category[];
  categories: Category[];
  category: Category[];
  catId: any;
  sortBy: any;
  selectedMenu: string;
  categoryId: any;
  catalogueList: any[];
  page_no: any;
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

  constructor(
    private apiService: ApiService,
    private route: Router,
    private storeService: StoreService
  ) {
  }

  // //Categories
  async getCategory() {
    this.categories = await this.storeService.getCategories();
  }
  getAllProduct() {
    this.catId = null
    this.sortBy = null
    this.getProduct(this.catId, this.sortBy)
  }
  getProduct(catId: any, sortBy: any) {
    if (!catId && !sortBy) {
      this.selectedMenu = 'all';
    } else {
      this.selectedMenu = catId;
    }
    console.log("Selected Menu", this.selectedMenu)
    this.categoryId = catId;
    localStorage.setItem('category_id', this.catId)
    this.catalogueList = []
    // this.apiService.getProductSByCategory(catId, this.storeID, sortBy, this.page_no).subscribe((res: any) => {
    //   if (res.message) {
    //     this.product = res.data.content;
    //     let productPagination = res.data;
    //     let totalPages = productPagination.totalPages;
    //     this.currentPage = productPagination.pageable.pageNumber + 1;
    //     this.currentPageElement = productPagination.pageable.pageNumber;
    //     this.isLastPage = productPagination.last;
    //     this.isFirstPage = productPagination.first;
    //     if (this.isFirstPage === false) {
    //       this.previousPage = this.currentPage - 1;
    //     } else {

    //     }
    //     if (this.isLastPage === false) {
    //       this.nextPage = this.currentPage + 1;
    //     } else {

    //     }
    //     console.log('Current Page: ' + this.currentPage)
    //     console.log('Previous Page: ' + this.previousPage)
    //     console.log('Next Page: ' + this.nextPage)

    //     this.fakeArray = new Array(totalPages);
    //     this.paginationArr = [];
    //     if (this.currentPage) {
    //       this.paginationArr.push(this.currentPage)
    //     }
    //     if (this.previousPage) {
    //       this.paginationArr.push(this.previousPage)
    //     }
    //     if (this.nextPage) {
    //       this.paginationArr.push(this.nextPage)
    //     }

    //     console.log('Pagination Arr[]:', this.paginationArr)
    //     console.log('getProduct()', this.product)
    //     console.log('ProducPagination: ', productPagination)
    //     console.log('totalPages: ', totalPages)

    //     let productObj = this.product;
    //     productObj.forEach(obj => {
    //       let productID = obj.id;
    //       let inventoryArr = obj.productInventories;

    //       if (inventoryArr.length !== 0) {
    //         if (this.singleInventoriesMode) {
    //           this.minVal = inventoryArr[0].price;
    //         } else {
    //           this.clusterPriceArr = [];
    //           inventoryArr.forEach(inventoryObj => {
    //             this.clusterPriceArr.push(inventoryObj.price);
    //             this.allProductInventory.push(inventoryObj);
    //           });
    //           // this.minVal = this.clusterPriceArr.reduce((a, b)=> Math.min(a, b));
    //           let count = false;

    //           inventoryArr.map(item => {
    //             if (item.price == this.minVal && !count) {
    //               count = true;
    //               count = true;
    //               //this.catalogueList.push(item)
    //               console.log('catalogueList: ', this.catalogueList)
    //             }
    //           })
    //         }
    //       } else {
    //         this.minVal = 0;
    //       }
    //       // creating an object of a specific product item 
    //       let data = {
    //         product_id: productID,
    //         minPrice: this.minVal
    //       }

    //       // populate product id as identifier of item and its min price into a new final object collection 
    //       this.priceObj.push(data);
    //     });

    //     console.log('initial catalogue product: ', this.catalogueList)
    //     console.log('all product inventories: ', this.allProductInventory)
    //   } else {
    //     // condition if required for different type of response message 
    //   }
    // }, error => {
    //   console.log(error)
    // })
  }
  //Navigation to category
  goToCategory(catId) {
    this.route.navigate(['catalogue/' + catId]);
  }

  ngOnInit() {
    this.getCategory();

  }

}
