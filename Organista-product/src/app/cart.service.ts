import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { Subject } from 'rxjs';
import { getEnabledCategories } from 'trace_events';
import { ApiService } from './api.service';
import { Cart, CartItem, CartItemRequest } from './components/models/cart';
import { Product, ProductInventory } from './components/models/product';
import { UserDeliveryDetail } from './components/models/userDeliveryDetail';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // TODO: Remove hardcoding of storeID
  private cartIdKey = 'anonym_cart_id';
  storeId: string = "McD";
  senderId: string = null;
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
        this.addToCart(product, quantity);
      }, error => {
        console.error("Failed to create cart");
        console.error(error);
      });
    } else {

      // Not giving option for product variants on frontend right now, so use the first found productvariant
      // const itemCode = product.productInventories.length > 0 ? product.productInventories[0].itemCode : '';
      // const sku = product.productInventories.length > 0 ? product.productInventories[0].sku : '';

      const cartItemRequest: CartItemRequest = {
        cartId: this.getCartId(),
        SKU: product.productInventories[0].sku,
        itemCode: product.productInventories[0].itemCode,
        price: product.price,
        productId: product.id,
        productPrice: product.price,
        quantity: quantity,
        specialInstruction: ''
      };

      // Add to cart, or create one if one doesn't exist
      // TODO: Delete cart in backend to seee what error you get
      this.apiService.postAddToCart(cartItemRequest).subscribe((res: any) => {
        this.getCartItems();
      }, error => {
        console.error("error adding to cart");
        console.error(error);
      });
    }
  }

  putCartItem(cartItem: CartItem) {
    if (!this.getCartId()) {
      this.addToCart(cartItem.productInventory.product, cartItem.quantity);
    } else {
      this.apiService.putCartItem(cartItem).subscribe((res: any) => {
        this.getCartItems();
      }, error => {
        console.error("error putting new cart item");
        console.error(error);
      });
    }
  }

  deleteCartItem(cartItem: CartItem, index: number) {
    this.cart = this.cart.splice(index, 1);

    this.apiService.deleteCartItemID(cartItem, cartItem.id).subscribe((res: any) => {
      this.getCartItems();
    }, error => {
      console.error("error deleting cart item");
      console.error(error);
    })
  }

  postGetDelivery(userDeliveryDetails: UserDeliveryDetail) {
    return new Promise(resolve => {
      let data = {
        customerId: this.senderId,
        deliveryProviderId: null,
        cartid: this.getCartId(),
        storeId: this.storeId,
        delivery: userDeliveryDetails
      };

      this.apiService.postTogetDeliveryFee(data).subscribe(async (res: any) => {
        resolve(res);
      }, error => {
        console.error("Error posting to delivery", error);
        resolve(error);
      })
    });
  }

  getGrandTotal() {
    return this.cart.reduce((subtotal: number, item: CartItem) => subtotal + item.price, 0);
  }
}
