import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { StoreAssets } from 'src/app/components/models/store';
import { StoreService } from '../../../../store.service';
// import { StoreService } from 'src/app/store.service';
import { Store, StoreAssets } from '../../../models/store';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  assets: StoreAssets;
  bannerUrl: string;

  constructor(
    private storeService: StoreService
  ) {
    // this.assets = {
    //   storeId: '',
    //   bannerUrl: '',
    //   bannerMobileUrl: '',
    //   logoUrl: '',
    //   qrCodeUrl: ''
    // }
  }

  //Banner
  async getAssets() {
    const store : Store = await this.storeService.getStoreInfoByDomainName();
    for (let storeAsset of store.storeAssets) {
      if (storeAsset.assetType === "BannerUrl") {
       this.bannerUrl = storeAsset.assetUrl;
      }
    }
  }
  ngOnInit(): void {
    this.getAssets();
  }

}
