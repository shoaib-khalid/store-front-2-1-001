import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { getEnabledCategories } from 'trace_events';
import { ApiService } from './api.service';
import { Cart, CartItem } from './components/models/cart';
import { Product } from './components/models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // TODO: Remove hardcoding of storeID
  private cartIdKey = 'anonym_cart_id';
  storeId: string = "McD";
  cart: CartItem[] = [];
  cartChange: Subject<CartItem[]> = new Subject<CartItem[]>();

  constructor(
    private apiService: ApiService
  ) {
    this.getCartItems();
    // this.cartChange.subscribe(cart => { this.cart = cart; });
  }

  private setCartId(cartId: string) {
    localStorage.setItem(this.cartIdKey, cartId);
  }

  private getCartId() {
    return localStorage.getItem(this.cartIdKey);
  }

  private removeCartId() {
    localStorage.removeItem(this.cartIdKey);
  }

  private getCartItems() {
    if (this.getCartId()) {
      this.apiService.getCartItemByCartID(this.getCartId()).subscribe((res: any) => {
        this.cart = res.data.content;
        this.cartChange.next(this.cart);
        console.log("getCartItems");
        console.log(this.cart);
      }, error => {
        console.error("Failed to get cart items");
        console.error(error);
      });
    }
  }

  addToCart(product: Product, quantity: number) {
    // Create cart if it doesn't exist
    if (!this.getCartId()) {
      const data = {
        storeId: this.storeId
      };
      this.apiService.postCreateCart(data).subscribe((res: any) => {
        this.setCartId(res.data.id);
      }, error => {
        console.error("Failed to create cart");
        console.error(error);
      });
    }

    const itemCode = product.productInventories.length > 0 ? product.productInventories[0].itemCode : '';
    const sku = product.productInventories.length > 0 ? product.productInventories[0].sku : '';
    const cartItem: CartItem = {
      cartId: this.getCartId(),
      id: '',
      itemCode: itemCode,
      price: product.price,
      productId: product.id,
      productPrice: product.price,
      quantity: quantity,
      SKU: sku,
      specialInstruction: ''
    };

    // Add to cart, or create one if one doesn't exist
    // TODO: Delete cart in backend to seee what error you get
    this.apiService.postAddToCart(cartItem).subscribe((res: any) => {
      this.getCartItems();
    }, error => {
      console.log("error adding to cart");
      console.error(error);
    });
  }
}
