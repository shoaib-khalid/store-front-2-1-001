import { Component, OnInit, HostListener, Input } from '@angular/core';
import { StoreService } from 'src/app/store.service';
import { StoreInfo } from '../../models/store';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  storeInformation: any[];
  storeNameRaw: any;
  storeContact: any;
  storeName: any;

  constructor(
    private storeService: StoreService
  ) {
  }
  @Input() layout: number | string;
  @Input() logo: number | string;
  async getVendorInfo() {
    const store: StoreInfo = await this.storeService.getStoreInfo();
    this.storeNameRaw = store.name;
    this.storeContact = store.phoneNumber;
  }

  ngOnInit() {
    this.getVendorInfo();
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
