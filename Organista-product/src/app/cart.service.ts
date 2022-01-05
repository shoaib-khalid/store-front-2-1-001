import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Cart, CartItem } from './components/models/cart';
import { Product } from './components/models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  storeId: string;
  cart: Cart;

  constructor(
    private apiService: ApiService
  ) {
    // TODO: Remove hardcoding of storeID
    this.storeId = "McD";
  }

  addToCart(product: Product, quantity: number) {
    // Create cart if it doesn't exist
    if (!localStorage.getItem('anonym_cart_id')) {
      /* data sample : { 
        "created": "2021-05-26T01:59:19.698Z", 
        "customerId": "string", 
        "id": "string", 
        "isOpen": true, 
        "storeId": "string", 
        "updated": "2021-05-26T01:59:19.699Z"} */
      const data = {
        storeId: this.storeId
      };
      console.log("Sending data");
      console.log(data);
      this.apiService.postCreateCart(data).subscribe((res: any) => {
        console.log(res);
        localStorage.setItem('anonym_cart_id', res.data.id);
        console.log("New Cart Id");
        console.log(localStorage.getItem('anonym_cart_id'));
      }, error => {
        console.warn("Failed to create cart");
        console.warn(error);
      });
    }

    const cartItem = {
      // id: null,
      quantity: quantity,
      cartId: localStorage.getItem('anonym_cart_id'),
      productId: product.id,
      itemCode: '',
      price: product.price,
      productPrice: product.price,
      weight: 0,
      SKU: product.sku,
      productName: product.name,
      specialInstruction: ''
    };

    // Add to cart, or create one if one doesn't exist
    this.apiService.postAddToCart(cartItem).subscribe((res: any) => {
      console.log("add to cart successful");
      console.info(res);
    }, error => {
      console.log("error adding to cart");
      console.error(error);
    });
  }
}
