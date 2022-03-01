import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StoreService } from "../../../../store.service";
import { Store } from "../../../models/store";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"],
})
export class ContentComponent implements OnInit {
  bannerUrl: string = "";

  constructor(private storeService: StoreService) {}

  //Banner
  async getAssets() {
    const store: Store = await this.storeService.getStoreInfo();
    for (const storeAsset of store.storeAssets) {
      if (storeAsset.assetType === "BannerDesktopUrl") {
        this.bannerUrl = storeAsset.assetUrl;
      }
    }
  }
  ngOnInit(): void {
    this.getAssets();
  }
}
