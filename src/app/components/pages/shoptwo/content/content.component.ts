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
import { StoreService } from 'src/app/store.service';
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private storeService: StoreService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.catId = params['catId']
      localStorage.setItem('category_id', this.catId)
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
    this.getProductsByCategory(this.catId, this.sortBy)
  }

  //SideBar Categories
  async getStoreCategories() {
    this.categories = await this.storeService.getCategories();
  }
  goToDetails(prodName) {
    this.router.navigate(['/product/' + prodName]);
  }

  async getProductsByCategory(categoryId, sortId) {
    if (!categoryId && !sortId) {
      this.selectedMenu = 'all';
    } else {
      this.selectedMenu = categoryId;
    }
    console.log('this.selectedMenu', this.selectedMenu);
    this.catId = categoryId;
    localStorage.setItem('category_id', this.catId);
    this.catalogueList = [];
    this.product = await this.storeService.getProductsByCategory(categoryId, sortId, this.page_no);
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
    this.getStoreCategories();
    this.getProductsByCategory(this.catId, this.sortBy);
  }
}
