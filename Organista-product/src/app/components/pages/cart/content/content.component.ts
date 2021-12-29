import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import cartList from '../../../../data/cart.json';
import shoppost from '../../../../data/shop.json'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  closeResult: string;
  modalContent: any;
  constructor(private modalService: NgbModal) { }
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
  public cart: { id: number, qty: number, price: number }[] = cartList;
  public calculateprice() {
    return this.cart.reduce((subtotal, item) => subtotal + item.qty * item.price, 0)
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
  }

}
