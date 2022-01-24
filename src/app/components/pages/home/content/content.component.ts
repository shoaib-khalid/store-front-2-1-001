import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import shoppost from '../../../../data/shop.json'
import blogtags from '../../../../data/blogtags.json';
import { ApiService } from '../../../../api.service';
import { Category } from 'src/app/components/models/category';
import { Product } from 'src/app/components/models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/cart.service';
import { CartItem } from 'src/app/components/models/cart';
//import { resolve } from 'path';
import Swal from 'sweetalert2';
import { StoreAsset } from 'src/app/components/models/store';

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

  storeID: any;
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
    private apiService: ApiService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,

  ) {

    this.storeID = "McD";
    this.assets = {
      bannerMobileUrl: '',
      bannerUrl: '',
      logoUrl: '',
      qrCodeUrl: '',
      storeId: ''
    }
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
  public shopbox: { img: string }[] = shoppost;
  public featuredpost: { img: string }[] = shoppost;
  public getBlogTags(items: string | any[]) {
    var elems = blogtags.filter((item: { id: string; }) => {
      return items.includes(item.id)
    });
    return elems;
  };

  // Banner
  bannerslides = [
    {
      photo: "assets/img/banner/1.jpg",
      proimg: "assets/img/products/8.png",
      ctaimg: "assets/img/cta/3.jpg",
      couponcode: "ORGANIC991",
      title: "Organic Vegetables",
      para: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula.",
    },
    {
      photo: "assets/img/banner/2.jpg",
      proimg: "assets/img/products/14.png",
      ctaimg: "assets/img/cta/2.jpg",
      couponcode: "ORGANIC991",
      title: "Organic Exotic Fruits",
      para: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula.",
    },
  ];
  bannerConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: true,
  }

  //Banner
  getAssets(): Promise<StoreAsset> {
    return new Promise((resolve, reject) => {
      this.apiService.getStoreAssets(this.storeID).subscribe((res: any) => {
        resolve(res.data);
      }, error => {
        console.error("Failed to get store assets", error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while fetching store assets. Please refresh the page',
        });
        reject(error);
      });
    });
  }
  //Categories
  getCategory(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getCategoryByStoreID(this.storeID).subscribe((res: any) => {
        resolve(res.data.content);
      }, error => {
        console.error("Error getting category", error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while fetching product categories. Please refresh the page.',
        });
        reject(error);
      })
    });
  }
  getStoreProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getProductSByStoreID(this.storeID).subscribe((res: any) => {
        resolve(res.data.content);
        // this.goToDetails(this.product);
      }, error => {
        console.error("Error getting store products", error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while fetching the store product. Please try again',
        });
        reject(error);
      })
    })
  }

  goToDetails(productID) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.productID = params['productID'];
    });
    this.route.navigate(['product-single-v2/:prodSeoName/'] + productID);
  }
  //Navigation to category
  goToCategory(catId) {
    this.route.navigate(['shop-v2/' + catId]);// + catId
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
        title: 'Great!',
        text: 'Item successfully added to cart.',
        confirmButtonColor: '#50BD4D'
      });
    } else {
      // TODO: Show Error message
    }
  }

  async ngOnInit() {
    this.isLoading = true;
    this.assets = await this.getAssets();
    this.categories = await this.getCategory();
    this.product = await this.getStoreProducts();
    this.isLoading = false;
  }
}

