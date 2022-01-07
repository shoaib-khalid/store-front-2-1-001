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
  modalContent: any;
  constructor(private modalService: NgbModal,
    private cartService: CartService
  ) {

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
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }
  public shopbox: { img: string }[] = shoppost;
  public calculateprice() {
    return this.cart.reduce((subtotal, item) => subtotal + item.quantity * item.price, 0)
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

}
