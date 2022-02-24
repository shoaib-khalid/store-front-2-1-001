import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import $ from 'jquery'
import { ApiService } from 'src/app/api.service';
import { StoreService } from 'src/app/store.service';
import { Category } from '../../models/category';
import { Store, StoreAsset } from '../../models/store';

@Component({
  selector: 'app-mobilemenu',
  templateUrl: './mobilemenu.component.html',
  styleUrls: ['./mobilemenu.component.css']
})
export class MobilemenuComponent implements OnInit {
  storeInfo: Store;
  categories: Category[];
  catId: any;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService
  ) {
    this.assets = {
      storeId: '',
      bannerUrl: '',
      bannerMobileUrl: '',
      logoUrl: '',
      qrCodeUrl: ''
    }

    this.activatedRoute.params.subscribe(params => {
      this.catId = params['catId']
      localStorage.setItem('category_id', this.catId)
    })
  }

  //Navigation to category
  goToCategory(catId) {
    // alert(catId)
    // return false;
    this.route.navigate(['catalogue/' + catId]);// + catId
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
    Promise.all([this.storeService.getStoreByDomainName(), this.storeService.getCategories()])
      .then((values) => {
        this.storeInfo = values[0];
        this.categories = values[1];
      }).catch(error => {
        console.error("Error getting values for mobile menu", error);
      }
      );
  }

}
