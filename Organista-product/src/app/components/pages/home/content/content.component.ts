import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import shoppost from '../../../../data/shop.json'
import categorypost from '../../../../data/category.json'
import blogcategory from '../../../../data/blogcategory.json';
import blogpost from '../../../../data/blog.json';
import blogtags from '../../../../data/blogtags.json';
import testimonialpost from '../../../../data/testimonial.json';
import { ApiService } from '../../../../api.service';
import { isNgTemplate } from '@angular/compiler';
import { Category } from 'src/app/components/models/category';
import { Product } from 'src/app/components/models/product';
import { HttpClient } from '@angular/common/http';
//import { resolve } from 'path';
import { Router, ActivatedRoute } from '@angular/router';
//import { resolve } from 'path';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  closeResult: string;
  public categoryArray: Category[];
  modalContent: any;
  data: any;
  product_id: any;
  productID: any;

  storeID: any;
  categories: Category[];
  category: Category[];
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

  constructor(private modalService: NgbModal,
    private apiService: ApiService,
    private httpClient: HttpClient,
    private route: Router,
    private activatedRoute: ActivatedRoute) {
    this.storeID = "McD";
  }
  open(content: any, item: any) {
    this.modalContent = item
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'andro_quick-view-modal p-0' });
  }
  // Increment decrement
  public counter: number = 1
  increment() {
    this.counter += 1;
  }
  decrement() {
    this.counter -= 1;
  }
  public shopbox: { img: string }[] = shoppost;
  public featuredpost: { img: string }[] = shoppost;
  // categories:any[] = [];
  //   newCategories:Category[];
  // //public blogcategory: { title: string }[] = blogcategory;
  //public testimonial: { photo: string }[] = testimonialpost;
  //public blogbox: { title: string, id: number }[] = blogpost;
  //public tags: { title: string, id: number }[] = blogtags;
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
  //Categories
  getCategory() {
    this.apiService.getCategoryByStoreID(this.storeID).subscribe((res: any) => {
      console.log('category obj: ', res)
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
  goToDetails(prodName){
    // alert(prodName)
    // return false;
    this.route.navigate(['product-single-v2/:prodSeoName/'] + prodName);
  }
  //Navigation to category
  goToCategory(catId) {
    // alert(catId)
    // return false;
    this.route.navigate(['shop-v2/'] + catId);// + catId
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
  getStoreProductById() {
    this.apiService.getProductSByStoreID(this.storeID).subscribe((res: any) => {
      console.log('Product Data', res);
      if (res.data.content.length > 1) {
        this.product = res.data.content;
        this.goToDetails(this.product);
        // console.log("name wala " + res.data.content[0].name);
        // console.log("Finding inventory by product id: " + this.product[0].productInventories[0].productId);
        // console.log("2ns " + res.data.content);
        //res.data.content.findInventory(res.data.content.productInventories[0].productId)
        //this.findInventory(this.product[0].id);
      }
    });
    
  }
  getProductByID(product_id) {
    this.apiService.getProductByProductID(product_id).subscribe((res: any) => {
      console.log('Product Deets', res)
      if (res.message) {
        resolve(res.data)
      }
    })
  }
  findInventory(productID) {
    var toFind = this.requestParamVariantNew;
    console.log("Products", this.product);
    console.log();
    var productArr = this.product.filter(function (content) {
      return content.id === productID;
    });
    console.log('Inventory: ',productArr);
    console.log();
    var inventories = productArr[0]['productInventories']
    console.log('inventories', inventories)
    var flag = true;
    var selectedItem;
    var productInventoryItems;
    for (let j = 0; j < productInventoryItems.length; j++) {
      if (toFind.includes(productInventoryItems[j].productVariantAvailableId)) {
        continue;
      } else {
        flag = false;
        break;
      }
    }
    if (flag) {
      console.log('selected item: ', selectedItem)
      this.popupPrice = selectedItem.price;
      this.popupItemcode = selectedItem.itemCode;
      this.popupSKU = selectedItem.sku;
      console.log('popup details: ' + this.popupPrice + " | " + this.popupItemcode + " | " + this.popupSKU)
    }
  }

  ngOnInit() {
    this.getCategory();
    this.getStoreProductById();
    //this.getProductByID(this.product_id);
    // this.api.getCategoryByStoreID("McD").subscribe((data)=>{
    //   console.log("Category obj",data);
    // })
  }
}

function resolve(data: any) {
  throw new Error('Function not implemented.');
}
// function resolve(data: any) {
//   throw new Error('Function not implemented.');
// }

