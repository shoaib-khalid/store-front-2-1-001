import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { StoreAsset } from 'src/app/components/models/store';
import { StoreService } from 'src/app/store.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  assets: StoreAsset;

  constructor(
    private storeService: StoreService
  ) {
    this.assets = {
      storeId: '',
      bannerUrl: '',
      bannerMobileUrl: '',
      logoUrl: '',
      qrCodeUrl: ''
    }
  }

  //Banner
  async getAssets() {
    this.assets = await this.storeService.getAssets();
  }
  ngOnInit(): void {
    this.getAssets();
  }

}
