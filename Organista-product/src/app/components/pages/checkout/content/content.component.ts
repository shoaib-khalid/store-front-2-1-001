import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/cart.service';
import { CartItem } from 'src/app/components/models/cart';
import { UserDeliveryDetail } from 'src/app/components/models/userDeliveryDetail';
import checkoutPst from '../../../../data/checkout.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  checkout: CartItem[];
  userDeliveryDetail: UserDeliveryDetail = {
    name: '',
    address: '',
    postcode: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    country: ''
  };

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

  selectCountry(e): void {
    this.userDeliveryDetail.country = e.target.value;
  }
}
