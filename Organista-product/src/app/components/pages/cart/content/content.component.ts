import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/api.service';
import { CartService } from 'src/app/cart.service';
import { CartItem } from 'src/app/components/models/cart';
import { Product } from 'src/app/components/models/product';
import cartList from '../../../../data/cart.json';
import shoppost from '../../../../data/shop.json'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  cart: CartItem[];
  product: Product[];
  closeResult: string;
  modalContent: CartItem;
  storeId: string;

  orderDiscount: number = 0;
  takeAwayFee: number = 0;
  deliveryCharges: number = 0;
  deliveryDiscount: number = 0;

  constructor(private modalService: NgbModal,
    private cartService: CartService,
    private apiService: ApiService
  ) {
    this.storeId = "McD";
  }
  open(content: any, item: CartItem) {
    this.modalContent = item;
    this.modalService.open(content, { centered: true, size: "lg", windowClass: 'andro_quick-view-modal p-0' });
  }
  // Increment decrement
  increment() {
    this.modalContent.quantity += 1;
  }
  decrement() {
    if (this.modalContent.quantity > 1) {
      this.modalContent.quantity -= 1;
    }
  }
  public shopbox: { img: string }[] = shoppost;
  public calculateSubtotal() {
    return this.cart.reduce((subtotal: number, item: CartItem) => subtotal + item.price, 0);
  };
  public calculateGrandTotal() {
    const subtotal = this.calculateSubtotal();
    return subtotal - this.orderDiscount + (this.takeAwayFee / 100 * subtotal) + this.deliveryCharges - this.deliveryDiscount;
  }
  upsellConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    autoplay: true,
    prevArrow: '.andro_upsells .slider-prev',
    nextArrow: '.andro_upsells .slider-next',
  }

  ngOnInit(): void {
    this.cart = this.cartService.cart;
    this.cartService.cartChange.subscribe(cart => { this.cart = cart; });
    this.getFeaturedProducts();
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  getFeaturedProducts() {
    this.apiService.getProductSByStoreID(this.storeId).subscribe((res: any) => {
      console.log('Product Data', res);
      if (res.data.content.length > 1) {
        this.product = res.data.content;
      }
    });
  }

  updateCartItem(cartItem: CartItem) {
    this.modalService.dismissAll();
    this.cartService.putCartItem(this.modalContent);
  }

  deleteCartItem(cartItem: CartItem, index: number) {
    this.cartService.deleteCartItem(cartItem, index);
  }

}
