import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import $ from 'jquery'
import { ApiService } from 'src/app/api.service';
import { StoreService } from 'src/app/store.service';
import { Category } from '../../models/category';
import { Store, StoreAssets } from '../../models/store';

@Component({
  selector: 'app-mobilemenu',
  templateUrl: './mobilemenu.component.html',
  styleUrls: ['./mobilemenu.component.css']
})
export class MobilemenuComponent implements OnInit {
  storeInfo: Store;
  categories: Category[];
  catId: any;
  assets: StoreAssets[];
  logoUrl: string;
 
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService
  ) {
      this.activatedRoute.params.subscribe(params => {
      this.catId = params['catId']
      localStorage.setItem('category_id', this.catId)
    })
  }

  //Navigation to category
  goToCategory(catId) {
    this.route.navigate(['catalogue/' + catId]);// + catId
  }

  async populateAssets(){
    const store : Store = await this.storeService.getStoreInfoByDomainName();
    for (let storeAsset of store.storeAssets) {
      if (storeAsset.assetType === "LogoUrl") {
       this.logoUrl = storeAsset.assetUrl;
      }
    }
  }

  ngOnInit(): void {
    function mobilemenu() {
      ($(".andro_aside .menu-item-has-children > a") as any).on('click', function (e) {
        var submenu = $(this).next(".sub-menu");
        e.preventDefault();

        submenu.slideToggle(200);
      });
    }
    mobilemenu();
    this.populateAssets();
    Promise.all([this.storeService.getStoreInfoByDomainName(), this.storeService.getCategories()])
      .then((values) => {
        this.storeInfo = values[0];
        this.categories = values[1];
      }).catch(error => {
        console.error("Error getting values for mobile menu", error);
      }
      );
  }

}
