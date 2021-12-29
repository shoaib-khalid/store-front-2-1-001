import { Component, OnInit } from '@angular/core';
import checkoutPst from '../../../../data/checkout.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }
  public isOne = true;
  public isTwo = true;
  public checkout: { id: number, qty: number, price: number }[] = checkoutPst;
  public calculateprice() {
    return this.checkout.reduce((subtotal, item) => subtotal + item.qty * item.price, 0)
  };
  ngOnInit(): void {
  }

}
