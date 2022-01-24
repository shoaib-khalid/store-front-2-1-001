import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import shoppost from '../../../../data/shop.json';
import { ApiService } from 'src/app/api.service';
import { Category } from 'src/app/components/models/category';
import { Product } from 'src/app/components/models/product';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { contains, removeData } from 'jquery';
import { CartService } from 'src/app/cart.service';
import Swal from 'sweetalert2';
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
  selectedMenu: string = "";
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
    private cartService: CartService,
    private platformLocation: PlatformLocation) {
    this.storeID = "McD";
    this.activatedRoute.params.subscribe(params => {
      this.catId = params['catId']
      localStorage.setItem('category_id', this.catId)
      console.log('Category ID: ', this.catId)
    })
  }
  open(content: any, item: any) {
    this.modalContent = item
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'andro_quick-view-modal p-0' });
  }
  closeModal() {
    this.modalService.dismissAll();
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
  getAllProduct() {
    this.catId = null
    this.sortBy = null
    this.getCategoryProducts(this.catId, this.sortBy)
  }

  //SideBar Categories
  getCategory() {
    this.apiService.getCategoryByStoreID(this.storeID).subscribe((res: any) => {
      console.log('category obj: ', res)
      if (res.message) {
        if (res.data.content.length > 1) {
          this.categories = res.data.content;
        } else {
          this.categories = res.data.content;
        }
      } else {
      }
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    })
  }
  goToDetails(prodName) {
    this.route.navigate(['shop-v2/' + prodName]);
  }

  getCategoryProducts(categoryId, sortId) {
    if (!categoryId && !sortId) {
      this.selectedMenu = 'all';
    } else {
      this.selectedMenu = categoryId;
    }
    console.log('this.selectedMenu', this.selectedMenu)
    this.catId = categoryId;
    localStorage.setItem('category_id', this.catId)
    this.catalogueList = []
    this.apiService.getProductSByCategory(categoryId, this.storeID, sortId, this.page_no).subscribe((res: any) => {
      console.log('This category product:', res)
      if (res.message) {
        this.product = res.data.content;
      }
    })
  }

  async addToCartFromModal(product: Product) {
    this.modalService.dismissAll();
    const addToCartResponse: any = await this.cartService.addToCart(product, this.counter);
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
  }

  ngOnInit() {
    this.catId = localStorage.getItem("category_id")
    this.getCategory();
    this.getCategoryProducts(this.catId, this.sortBy);

  }
}
