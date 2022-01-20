import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { Subject } from 'rxjs';
import { getEnabledCategories } from 'trace_events';
import { ApiService } from './api.service';
import { Cart, CartItem, CartItemRequest, CartTotals } from './components/models/cart';
import { DeliveryCharge } from './components/models/delivery';
import { Product, ProductInventory } from './components/models/product';
import { StoreInfo } from './components/models/store';
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

  deliveryOption: string;

  constructor(
    private apiService: ApiService
  ) {
    this.getCartItems();
    this.getDeliveryOption();
  }

  private setCartId(cartId: string) {
    localStorage.setItem(this.cartIdKey, cartId);
  }

  public getCartId() {
    return localStorage.getItem(this.cartIdKey);
  }

  private removeCartId() {
    localStorage.removeItem(this.cartIdKey);
  }

  getDeliveryOption() {
    return new Promise(resolve => {
      this.apiService.getDeliveryOption(this.storeId).subscribe(async (res: any) => {
        if (res.message) {
          this.deliveryOption = res.data;
          resolve(res.data);
        } else {
          console.log('getDeliveryOption operation failed')
        }

      }, error => {
        console.log(error)
      })
    })
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

  private createCart() {
    const data = {
      storeId: this.storeId
    };

    return new Promise((resolve, reject) => {
      this.apiService.postCreateCart(data).subscribe((res: any) => {
        this.setCartId(res.data.id);
        resolve(res.data);
      }, error => {
        console.error("Failed to create cart", error);
        reject(error);
      });
    });
  }

  async addToCart(product: Product, quantity: number) {
    // Create cart if it doesn't exist
    if (!this.getCartId()) {
      const createdCart: any = await this.createCart();
      try {
        this.setCartId(createdCart.id);
      } catch (error) {
        console.error("Error creating and adding to cart", error);
      }
    }

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

    return new Promise((resolve, reject) => {
      this.apiService.postAddToCart(cartItemRequest).subscribe((res: any) => {
        resolve(res);
        this.getCartItems();
      }, error => {
        console.error("Error adding to cart", error);
        reject(error);
      })
    });
  }

  putCartItem(cartItem: CartItem) {
    if (!this.getCartId()) {
      return this.addToCart(cartItem.productInventory.product, cartItem.quantity);
    } else {
      return new Promise((resolve, reject) => {
        this.apiService.putCartItem(cartItem).subscribe((res: any) => {
          resolve(res);
          this.getCartItems();
        }, error => {
          console.error("Error putting cart item", error);
          reject(error);
        })
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

  getDeliveryFee(userDeliveryDetails: UserDeliveryDetail): Promise<DeliveryCharge> {
    let data = {
      customerId: null,
      deliveryProviderId: null,
      cartid: this.getCartId(),
      storeId: this.storeId,
      delivery: userDeliveryDetails
    };

    return new Promise(resolve => {
      this.apiService.postTogetDeliveryFee(data).subscribe(async (res: any) => {
        if (Array.isArray(res.data)) {
          resolve(res.data[0]);
        } else {
          resolve(res.data)
        }
        console.log("Received Delivery fee");
      }, error => {
        console.error("Error posting to delivery", error);
        resolve(error);
      })
    });
  }

  getSubTotal() {
    return this.cart.reduce((subtotal: number, item: CartItem) => subtotal + item.price, 0);
  }

  getStoreInfoById(): Promise<StoreInfo> {
    return new Promise((resolve, reject) => {
      this.apiService.getStoreHoursByID(this.storeId).subscribe((res: any) => {
        resolve(res.data);
      }, error => {
        console.error(error);
        reject(error);
      })
    })
  }

  getDiscount(deliveryCharge): Promise<CartTotals> {
    return new Promise((resolve, reject) => {
      this.apiService.getDiscount(this.getCartId(), deliveryCharge).subscribe(async (res: any) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      }, error => {
        console.error("Error getting discount", error);
        reject(error);
      })
    })
  }
}
