import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from 'src/app/cart.service';
import { CartItem } from 'src/app/components/models/cart';
import cartList from '../../../../data/cart.json';
import shoppost from '../../../../data/shop.json'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  cart: CartItem[];
  closeResult: string;
  modalContent: CartItem;

  constructor(private modalService: NgbModal,
    private cartService: CartService
  ) { }
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
  public calculateprice() {
    return this.cart.reduce((subtotal: number, item: CartItem) => subtotal + item.price, 0);
  };
  taxPrice = 9.99;
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
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  updateCartItem(cartItem: CartItem) {
    this.modalService.dismissAll();
    this.cartService.putCartItem(this.modalContent);
  }

  deleteCartItem(cartItem: CartItem, index: number) {
    this.cartService.deleteCartItem(cartItem, index);
  }

}
