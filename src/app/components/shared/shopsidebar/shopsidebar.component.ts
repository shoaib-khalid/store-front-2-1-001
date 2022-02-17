import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/api.service";
import { Category } from "../../models/category";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-shopsidebar",
  templateUrl: "./shopsidebar.component.html",
  styleUrls: ["./shopsidebar.component.css"],
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
  ) {}

  // //Categories
  async getCategory() {
    this.categories = await this.storeService.getCategories();
  }
  getAllProduct() {
    this.catId = null;
    this.sortBy = null;
    this.getProduct(this.catId, this.sortBy);
  }
  getProduct(catId: any, sortBy: any) {
    if (!catId && !sortBy) {
      this.selectedMenu = "all";
    } else {
      this.selectedMenu = catId;
    }
    console.log("Selected Menu", this.selectedMenu);
    this.categoryId = catId;
    localStorage.setItem("category_id", this.catId);
    this.catalogueList = [];
  }
  //Navigation to category
  goToCategory(catId) {
    this.route.navigate(["catalogue/" + catId]);
  }

  ngOnInit() {
    this.getCategory();
  }
}
