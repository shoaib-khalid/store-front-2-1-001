import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/cart.service';
import { CartItem } from 'src/app/components/models/cart';
import checkoutPst from '../../../../data/checkout.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  checkout: CartItem[];

  constructor(
    private cartService: CartService
  ) { }
  public isOne = true;
  public isTwo = true;
  public calculateprice() {
    return this.checkout.reduce((subtotal: number, item: CartItem) => subtotal + item.price, 0);
  };
  ngOnInit(): void {
    this.checkout = this.cartService.cart;
    this.cartService.cartChange.subscribe(cart => { this.checkout = cart; });
  }

}
