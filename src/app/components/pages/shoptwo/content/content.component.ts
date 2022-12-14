import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import shoppost from "../../../../data/shop.json";
import { ApiService } from "../../../../api.service";
import { Category } from "../../../models/category";
import { Product } from "../../../models/product";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { contains, removeData } from "jquery";
import { CartService } from "../../../../cart.service";
import { StoreService } from "../../../../store.service";
import Swal from "sweetalert2";
import { Store } from "../../../models/store";
@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"],
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
  isLoading: boolean;
  name: any;
  sortId: any = 0;
  currencySymbol: string = "";
  selectedCategory: Category;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private storeService: StoreService
  ) {
    
  }
  open(content: any, item: any) {
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
    this.counter -= 1;
  }
  public shopbox: { img: string }[] = shoppost;

  //categories
  getAllProduct() {
    this.catId = null;
    this.sortBy = null;
    this.getProductsByCategory(this.catId, this.sortId);
  }

  //SideBar Categories
  async getStoreCategories() {
    this.categories = await this.storeService.getCategories();
  }
  goToDetails(prodName) {
    this.router.navigate(["/product/" + prodName]);
  }

  async getProductsByCategory(categoryId, sortId) {
    if (!categoryId) {
      this.selectedMenu = "All";
    } else {
      this.selectedMenu = categoryId;
    }
    this.isLoading = true;
    this.catId = categoryId;
    localStorage.setItem("category_id", this.catId);
    if (this.catId) {
      this.selectedCategory = await this.storeService.getCategoryById(this.catId)
      this.name = this.selectedCategory.name;
    } else {
      this.name = this.selectedMenu
    }
    this.catalogueList = [];
    this.product = await this.storeService.getProductsByCategory(
      categoryId,
      sortId,
      this.page_no
    );
    this.page = 1
    this.isLoading = false;
  }
  sortByValue() {
    this.getProductsByCategory(this.catId, this.sortId);
  }

  async addToCartFromModal(product: Product) {
    this.modalService.dismissAll();
    const addToCartResponse: any = await this.cartService.addToCart(
      product,
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
  }
  async getStoreInfo() {
    try {
      const storeInfo: Store = await this.storeService.getStoreInfo();
      this.currencySymbol = storeInfo.regionCountry.currencySymbol;
    } catch (error) {
      console.error("Error getting storeInfo", error);
    }
  }


  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params["catId"] !== "all") {
        this.catId = params["catId"];
      } else {
        this.catId = null
      }
      this.getStoreCategories();
      this.getProductsByCategory(this.catId, this.sortId);
      this.getStoreInfo();
    });
  }
}
