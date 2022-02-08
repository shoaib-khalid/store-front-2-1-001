import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Category } from '../../../models/category';
import { Product } from '../../../models/product';
import { StoreAsset } from '../../../models/store';
import { CartService } from '../../../../cart.service';
import { StoreService } from '../../../../store.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  isLoading: boolean;

  closeResult: string;
  public categoryArray: Category[];
  modalContent: Product;
  data: any;
  product_id: any;
  productID: any;

  categories: Category[];
  product: Product[];
  requestParamVarianNew: any;
  detailsObj: any;
  productItemCode: any;
  productPrice: any;
  productSku: any;
  galleryImages: any[];
  imageCollection: any[];
  productAssets: any;
  requestParamVariantNew: any = [];
  popupPrice: any;
  popupItemcode: any;
  popupSKU: any;
  catalogueList: any;
  noPrice: any;
  assets: StoreAsset;
  bannerExist: boolean = false;
  assetsData: any;
  banner: any;

  constructor(private modalService: NgbModal,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private storeService: StoreService
  ) {
    this.assets = {
      bannerMobileUrl: '',
      bannerUrl: '',
      logoUrl: '',
      qrCodeUrl: '',
      storeId: ''
    };
  }

  open(content: any, item: Product) {
    this.counter = 1;
    this.modalContent = item;
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'andro_quick-view-modal p-0' });
  }
  closeModal() {
    this.modalService.dismissAll();
  }
  // Increment decrement
  public counter: number = 1;
  increment() {
    this.counter += 1;
  }
  decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }

  // Banner
  // bannerslides = [
  //   {
  //     photo: "assets/img/banner/1.jpg",
  //     proimg: "assets/img/products/8.png",
  //     ctaimg: "assets/img/cta/3.jpg",
  //     couponcode: "ORGANIC991",
  //     title: "Organic Vegetables",
  //     para: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula.",
  //   },
  //   {
  //     photo: "assets/img/banner/2.jpg",
  //     proimg: "assets/img/products/14.png",
  //     ctaimg: "assets/img/cta/2.jpg",
  //     couponcode: "ORGANIC991",
  //     title: "Organic Exotic Fruits",
  //     para: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula.",
  //   },
  // ];
  // bannerConfig = {
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: false,
  //   dots: false,
  //   autoplay: true,
  // }

  goToDetails(productID) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.productID = params['productID'];
    });
    this.route.navigate(['product/:prodSeoName/'] + productID);
  }
  //Navigation to category
  goToCategory(catId) {
    this.route.navigate(['catalogue/' + catId]);// + catId
  }

  // Fresharrivals
  freshConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    autoplay: false,
    prevArrow: '.andro_fresh-arrivals .slider-prev',
    nextArrow: '.andro_fresh-arrivals .slider-next',
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  }

  async addToCartFromModal(product: Product) {
    this.isLoading = true;
    this.modalService.dismissAll();
    const addToCartResponse: any = await this.cartService.addToCart(product, this.counter);
    this.isLoading = false;
    if (addToCartResponse.status === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Item added to Cart',
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        position: 'bottom-right'
      });
    } else {
      // TODO: Show Error message
    }
  }

  resolveLoading() {
    if (this.product && this.assets && this.categories) {
      this.isLoading = false;
    }
  }

  async ngOnInit() {
    this.isLoading = true;

    await this.storeService.parseStoreFromUrl();
    Promise.all([this.storeService.getAssets(), this.storeService.getCategories(), this.storeService.getStoreProducts()])
      .then((values) => {
        this.assets = values[0];
        this.categories = values[1];
        this.product = values[2];
        this.isLoading = false;
      }).catch(error => {
        console.error("Error getting values for homepage" + error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while fetching store details. Please refresh the page.',
        });
      }
      );
  }

  // goToProductPage() {
  //   this.cartService.previousUrl = location.href;
  //   this.route.nav
  // }
}

