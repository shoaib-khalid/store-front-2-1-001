import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { resolve } from 'dns';
import { promise } from 'protractor';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  storeInformation: any[];
  storeNameRaw: any;
  storeID: any;
  storeContact: any;
  storeName: any;

  constructor(
    private apiService: ApiService,
    private platformLocation: PlatformLocation,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient
    ) { this.storeID = "McD";
        this.storeName = "McD"; }
  @Input()  layout: number | string;
  @Input()  logo: number | string;
  getVendorInfo(storeID){
      this.apiService.getStoreInfoByID(storeID).subscribe((res: any)=>{
        if (res.message) {
          console.log('Info ', res.data)
        }
          let data = res.data
        let exist = data.length
        if(res.message){
          if(exist == 0){
            return false
          }
          this.storeNameRaw = data.name;
          this.storeID = data.id;
          this.storeContact = data.phoneNumber
        }
   })
  }

  ngOnInit() {
    this.getVendorInfo(this.storeID);
  }
  ScrolltoTop() {
    const navbar = document.getElementById('backToTop');
    if (document.body.scrollTop >= 300 || document.documentElement.scrollTop > 300) {
      navbar.classList.add('active');
    } else {
      navbar.classList.remove('active');
    }
  }
  isShow: boolean;
  topPosToStartShowing = 300;

  @HostListener('window:scroll')
  checkScroll() {

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    } 
  }

  // TODO: Cross browsing
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

}
