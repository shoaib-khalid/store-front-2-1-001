import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import $ from 'jquery'
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-mobilemenu',
  templateUrl: './mobilemenu.component.html',
  styleUrls: ['./mobilemenu.component.css']
})
export class MobilemenuComponent implements OnInit {
  storeID: any;
  categories: any;
  logo: any;

  constructor( private apiService: ApiService,
    private httpClient: HttpClient,
    private route: Router,
    private activatedRoute: ActivatedRoute) { this.storeID = "McD" }

    //Logo
  getAssets(storeID){
    return new Promise(resolve => {
        // check count Item in Cart 
        this.apiService.getStoreAssets(storeID).subscribe((res: any) => {
            resolve(res.data)
            let data = res.data;
            this.logo = data.logoUrl;
            // this.assetsData = res.data;
        }, error => {
            // Swals.fire("Oops...", "Error : <small style='color: red; font-style: italic;'>" + error.error.message + "</small>", "error")
        }) 
        
    });

}
   //Categories
   getCategory() {
    this.apiService.getCategoryByStoreID(this.storeID).subscribe((res: any) => {
      if (res.message) {
        if (res.data.content.length > 1) {
          this.categories = res.data.content;
        } else {
          this.categories = res.data.content;
        }
        //console.log('newCategories getCategory: ', this.categories);
      } else {
      }
    }, error => {
      console.log(error)
    })
  }
  //Navigation to category
  goToCategory(catId) {
    // alert(catId)
    // return false;
    this.route.navigate(['shop-v2/' + catId]);// + catId
  }

  ngOnInit(): void {
    
    function mobilemenu() {
      ($(".andro_aside .menu-item-has-children > a") as any).on('click', function (e) {
        var submenu = $(this).next(".sub-menu");
        e.preventDefault();

        submenu.slideToggle(200);
      });
    }
    mobilemenu()
    this.getAssets(this.storeID);
    this.getCategory();
  }

}
