import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { CartItem, CartItemRequest, CartTotals } from './components/models/cart';
import { DeliveryCharge, DeliveryDetails } from './components/models/delivery';
import { Product, ProductInventory } from './components/models/product';
import { Store } from './components/models/store';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartIdKey = 'anonym_cart_id';
  senderId: string = null;
  cart: CartItem[] = [];
  cartChange: Subject<CartItem[]> = new Subject<CartItem[]>();

  constructor(
    private storeService: StoreService,
    private apiService: ApiService
  ) {
    this.getCartItems();
    storeService.storeIdChange.subscribe(storeId => {
      // Remove cart if store changes
      this.removeCart();
    });
  }

  //Routing

  // public startSaveHistory():void{
  //   this.router.events.subscribe((event) =>{
  //     if( event instanceof NavigationEnd){
  //       this.history.push(event.urlAfterRedirects)
  //     }
  //   })
  // }

  // public getHistory(): string[]{
  //   return this.history
  // }

  // public goBack(): void{
  //   this.history.pop();

  //   if(this.history.length > 0){
  //     this.location.back()
  //   }else{
  //     this.router.navigateByUrl("/")
  //   }
  // }

  // public getPreviousUrl(): string {
  //   if(this.history.length > 0){
  //     return this.history[this.history.length - 3];
  //   }
  //   return '';
  // }

  private setCartId(cartId: string) {
    localStorage.setItem(this.cartIdKey, cartId);
  }

  public getCartId() {
    return localStorage.getItem(this.cartIdKey);
  }

  private removeCart() {
    localStorage.removeItem(this.cartIdKey);
    this.cart = [];
    this.cartChange.next(this.cart);
  }

  getCartItems() {
    if (this.getCartId()) {
      this.apiService.getCartItemByCartID(this.getCartId()).subscribe((res: any) => {
        this.cart = res.data.content;
        this.cartChange.next(this.cart);
      }, error => {
        console.error("Failed to get cart items", error);
      });
    }
  }

  createCart() {
    const data = {
      storeId: this.storeService.getStoreId()
    };

    return new Promise((resolve, reject) => {
      this.apiService.postCreateCart(data).subscribe((res: any) => {
        resolve(res.data);
        this.setCartId(res.data.id);
        this.getCartItems();
      }, error => {
        console.error("Failed to create cart", error);
        reject(error);
      });
    });
  }

  async addToCart(product: Product, quantity: number) {
    // Create cart if it doesn't exist
    if (!this.getCartId()) {
      await this.createCart();
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

    return new Promise((resolve, reject) => {
      this.apiService.deleteCartItemID(cartItem, cartItem.id).subscribe((res: any) => {
        resolve(res);
        this.getCartItems();
      }, error => {
        console.error("Error deleting cart item", error);
        reject(error);
      })
    });
  }

  getDeliveryFee(DeliveryDetails: DeliveryDetails): Promise<DeliveryCharge> {
    let data = {
      customerId: undefined,
      deliveryProviderId: null,
      cartId: this.getCartId(),
      storeId: this.storeService.getStoreId(),
      delivery: DeliveryDetails
    };
    console.log('cartID ', data)
    return new Promise((resolve, reject) => {
      this.apiService.postTogetDeliveryFee(data).subscribe(async (res: any) => {
        if (Array.isArray(res.data)) {
          resolve(res.data[0]);
          console.log(res.data)
        } else {
          resolve(res.data);console.log(res.data)
        }
      }, error => {
        console.error("Error posting to delivery", error);
        reject(error);
      })
    });
  }

  getSubTotal() {
    return this.cart.reduce((subtotal: number, item: CartItem) => subtotal + item.price, 0);
  }

  getDiscount(deliveryCharge): Promise<CartTotals> {
    return new Promise((resolve, reject) => {
      this.apiService.getDiscount(this.getCartId(), deliveryCharge).subscribe(async (res: any) => {
        resolve(res.data);
      }, error => {
        console.error("Error getting discount", error);
        reject(error);
      })
    })
  }

  async confirmCashOnDelivery(deliveryDetails: DeliveryDetails, deliveryFee: DeliveryCharge) {
    const deliveryOption: any = await this.storeService.getDeliveryOption();

    const data = {
      cartId: this.getCartId(),
      customerId: null,
      customerNotes: deliveryDetails.deliveryNotes,
      orderPaymentDetails: {
        accountName: deliveryDetails.deliveryContactName,
        deliveryQuotationAmount: deliveryFee.price,
        deliveryQuotationReferenceId: deliveryFee.refId,
        gatewayId: ""
      },
      orderShipmentDetails: {
        address: deliveryDetails.deliveryAddress,
        city: deliveryDetails.deliveryCity,
        country: deliveryDetails.deliveryCountry,
        email: deliveryDetails.deliveryContactEmail,
        phoneNumber: deliveryDetails.deliveryContactPhone,
        receiverName: deliveryDetails.deliveryContactName,
        state: deliveryDetails.deliveryState,
        zipcode: deliveryDetails.deliveryPostcode,
        deliveryProviderId: deliveryFee.providerId,
        deliveryType: deliveryOption.type
      }
    }

    return new Promise((resolve, reject) => {
      this.apiService.postConfirmCOD(data, data.cartId, false).subscribe((res: any) => {
        resolve(res);
        if (res.status === 201) {
          this.removeCart();
        }
      }, error => {
        console.error("Error confirming Cash on Delivery", error);
        reject(error);
      });
    })
  }
}
