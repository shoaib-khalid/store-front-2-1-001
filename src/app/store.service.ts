import { PlatformLocation } from "@angular/common";
import { Injectable, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs/internal/Subject";
import { ApiService } from "./api.service";
import { CartService } from "./cart.service";
import { Category } from "./components/models/category";
import { Product } from "./components/models/product";
import { StoreAssets, Store } from "./components/models/store";
import { isDevMode } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  store: Store;

  storeIdKey: string = "store_id";
  storeNameKey: string = "store_name";
  storeIdChange: Subject<string> = new Subject<string>();
  getAssets: any;

  constructor(private apiService: ApiService) {}

  async parseStoreFromUrl() {
    let currBaseUrl = location.origin;

    if (isDevMode()) {
      console.log("Running in dev mode");
      currBaseUrl = "mcd.dev-pk2.symplified.ai";
    }

    // For testing purposes
    // currBaseUrl = "awan-tech.dev-pk2.symplified.ai";
    // currBaseUrl = "mcd.dev-pk2.symplified.ai";

    currBaseUrl = currBaseUrl.split(".")[0].replace(/^(https?:|)\/\//, "");
    const store: Store = await this.getStoreByDomainName(currBaseUrl);
    console.log("StoreInfo: ", store.id);
    if (this.getStoreId() !== store.id) {
      this.setStoreId(store.id);
      this.storeIdChange.next();
    }
  }

  private setStoreId(storeId: string) {
    localStorage.setItem(this.storeIdKey, storeId);
  }

  getStoreId() {
    return localStorage.getItem(this.storeIdKey);
  }

  getStoreInfo(): Promise<Store> {
    return new Promise((resolve, reject) => {
      this.apiService.getStoreHoursByID(this.getStoreId()).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  getStoreInfoByDomainName(): Promise<Store> {
    return new Promise((resolve, reject) => {
      this.apiService.getStoreInfoByDomainName(this.getStoreId()).subscribe(
        (res: any) => {
          resolve(res.data.content[0]);
        },
        (error) => {
          console.error("Failed to get store assets", error);
          reject(error);
        }
      );
    });
  }

  getCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getCategoryByStoreID(this.getStoreId()).subscribe(
        (res: any) => {
          resolve(res.data.content);
        },
        (error) => {
          console.error("Error getting category", error);
          reject(error);
        }
      );
    });
  }

  getStoreProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getProductSByStoreID(this.getStoreId()).subscribe(
        (res: any) => {
          resolve(res.data.content);
        },
        (error) => {
          console.error("Error getting store products", error);
          reject(error);
        }
      );
    });
  }

  getProductDetailsByName(seoName: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      this.apiService.getProductsByName(seoName, this.getStoreId()).subscribe(
        (res: any) => {
          resolve(res.data.content[0]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getProductsByCategory(
    categoryId: string,
    sortId: string,
    pageNo: number
  ): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getProductSByCategory(categoryId, this.getStoreId(), sortId, pageNo)
        .subscribe(
          (res: any) => {
            resolve(res.data.content);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getDeliveryOption() {
    return new Promise((resolve, reject) => {
      this.apiService.getDeliveryOption(this.getStoreId()).subscribe(
        async (res: any) => {
          resolve(res.data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  private getStoreByDomainName(domainName: string): Promise<Store> {
    console.log("Domain name: ", domainName);

    return new Promise((resolve, reject) => {
      this.apiService.getStoreInfoByDomainName(domainName).subscribe(
        (res: any) => {
          resolve(res.data.content[0]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
