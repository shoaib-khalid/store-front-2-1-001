import { PlatformLocation } from '@angular/common';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './api.service';
import { Category } from './components/models/category';
import { Product } from './components/models/product';
import { StoreAsset, StoreInfo } from './components/models/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  store: StoreInfo;

  storeIdKey: string = "store_id";
  storeNameKey: string = "store_name";

  storeDomainName: string = "";

  // defaultStoreId: string = "217cc14c-fbf0-4af7-b927-9328458a61d0";
  defaultStoreId: string = "McD";
  defaultStoreDomainName: string = "mcd";

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
  }

  getStoreNameFromUrl(): string {
    let currBaseUrl = location.origin;
    if (currBaseUrl.match(/localhost/g)) {
      return this.defaultStoreDomainName;
    }

    return currBaseUrl.split('.')[0];
    // return location.origin.split('.')[0];
  }

  parseStoreIdFromUrl() {
    let currBaseUrl = location.origin;
    let localURL = currBaseUrl.match(/localhost/g);

    if (localURL != null) {
      // use this for localhost
      this.storeDomainName = "mcd";
    } else {
      this.storeDomainName = currBaseUrl.split('.')[0].replace(/^(https?:|)\/\//, '');
    }
    console.log('Catalogue Storename: ' + this.storeDomainName);

    this.activatedRoute.queryParams.subscribe(params => {
      let storeID = params['storeId'];
      if (!storeID) {
        storeID = this.defaultStoreId;
      }
      this.setStoreId(storeID);
      console.log("Store ID: ", this.getStoreId());
    });
  }

  private setStoreId(storeId: string) {
    localStorage.setItem(this.storeIdKey, storeId);
  }

  getStoreId() {
    // let storeId = localStorage.getItem(this.storeIdKey);
    // let localStoreName = localStorage.getItem(this.storeNameKey);

    // if (localStoreName !== this.getStoreNameFromUrl) {
    //   this.parseStoreIdFromUrl();
    // }

    if (!localStorage.getItem(this.storeIdKey)) {
      this.parseStoreIdFromUrl();
    }

    return localStorage.getItem(this.storeIdKey);
  }

  getStoreInfo(): Promise<StoreInfo> {
    return new Promise((resolve, reject) => {
      this.apiService.getStoreHoursByID(this.getStoreId()).subscribe((res: any) => {
        resolve(res.data);
      }, error => {
        console.error(error);
        reject(error);
      })
    })
  }

  getAssets(): Promise<StoreAsset> {
    return new Promise((resolve, reject) => {
      this.apiService.getStoreAssets(this.getStoreId()).subscribe((res: any) => {
        resolve(res.data);
      }, error => {
        console.error("Failed to get store assets", error);
        reject(error);
      });
    });
  }

  getCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getCategoryByStoreID(this.getStoreId()).subscribe((res: any) => {
        resolve(res.data.content);
      }, error => {
        console.error("Error getting category", error);
        reject(error);
      })
    });
  }

  getStoreProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getProductSByStoreID(this.getStoreId()).subscribe((res: any) => {
        resolve(res.data.content);
      }, error => {
        console.error("Error getting store products", error);
        reject(error);
      })
    })
  }

  getProductDetailsByName(seoName: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      this.apiService.getProductsByName(seoName, this.getStoreId()).subscribe((res: any) => {
        resolve(res.data.content[0]);
      }, error => {
        reject(error);
      });
    });
  }

  getProductsByCategory(categoryId: string, sortId: string, pageNo: number): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getProductSByCategory(categoryId, this.getStoreId(), sortId, pageNo).subscribe((res: any) => {
        console.log("Received Products by Category: ", res);
        resolve(res.data.content);
      }, error => {
        reject(error);
      })
    })
  }

  getDeliveryOption() {
    return new Promise((resolve, reject) => {
      this.apiService.getDeliveryOption(this.getStoreId()).subscribe(async (res: any) => {
        resolve(res.data);
      }, error => {
        reject(error);
      })
    })
  }
}
