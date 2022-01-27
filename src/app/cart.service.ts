import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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

  private history: string [] = []

  // TODO: Remove hardcoding of storeID
  private cartIdKey = 'anonym_cart_id';
  storeId: string = "McD";
  senderId: string = null;
  cart: CartItem[] = [];
  cartChange: Subject<CartItem[]> = new Subject<CartItem[]>();

  deliveryOption: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private location: Location
  ) {
    this.getCartItems();
    this.getDeliveryOption();
  }

  //Routing

  public startSaveHistory():void{
    this.router.events.subscribe((event) =>{
      if( event instanceof NavigationEnd){
        this.history.push(event.urlAfterRedirects)
      }
    })
  }

  public getHistory(): string[]{
    return this.history
  }

  public goBack(): void{
    this.history.pop();

    if(this.history.length > 0){
      this.location.back()
    }else{
      this.router.navigateByUrl("/")
    }
  }

  public getPreviousUrl(): string {
    if(this.history.length > 0){
      return this.history[this.history.length - 3];
    }
    return '';
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

  private getCartItems() {
    if (this.getCartId()) {
      this.apiService.getCartItemByCartID(this.getCartId()).subscribe((res: any) => {
        this.cart = res.data.content;
        this.cartChange.next(this.cart);
      }, error => {
        console.error("Failed to get cart items", error);
      });
    }
  }

  private createCart() {
    const data = {
      storeId: this.storeId
    };

    return new Promise((resolve, reject) => {
      this.apiService.postCreateCart(data).subscribe((res: any) => {
        resolve(res.data);
        this.setCartId(res.data.id);
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

  getDeliveryFee(userDeliveryDetails: UserDeliveryDetail): Promise<DeliveryCharge> {
    let data = {
      customerId: null,
      deliveryProviderId: null,
      cartid: this.getCartId(),
      storeId: this.storeId,
      delivery: userDeliveryDetails
    };

    return new Promise((resolve, reject) => {
      this.apiService.postTogetDeliveryFee(data).subscribe(async (res: any) => {
        if (Array.isArray(res.data)) {
          resolve(res.data[0]);
        } else {
          resolve(res.data);
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
        resolve(res.data);
      }, error => {
        console.error("Error getting discount", error);
        reject(error);
      })
    })
  }

  getDeliveryOption() {
    return new Promise((resolve, reject) => {
      this.apiService.getDeliveryOption(this.storeId).subscribe(async (res: any) => {
        resolve(res.data);
      }, error => {
        reject(error);
      })
    })
  }

  async confirmCashOnDelivery(userDeliveryDetails: UserDeliveryDetail, deliveryFee: DeliveryCharge) {
    const deliveryOption: any = await this.getDeliveryOption();

    const data = {
      cartId: this.getCartId(),
      customerId: null,
      customerNotes: userDeliveryDetails.deliveryNotes,
      orderPaymentDetails: {
        accountName: userDeliveryDetails.deliveryContactName,
        deliveryQuotationAmount: deliveryFee.price,
        deliveryQuotationReferenceId: deliveryFee.refId,
        gatewayId: ""
      },
      orderShipmentDetails: {
        address: userDeliveryDetails.deliveryAddress,
        city: userDeliveryDetails.deliveryCity,
        country: userDeliveryDetails.deliveryCountry,
        email: userDeliveryDetails.deliveryContactEmail,
        phoneNumber: userDeliveryDetails.deliveryContactPhone,
        receiverName: userDeliveryDetails.deliveryContactName,
        state: userDeliveryDetails.deliveryState,
        zipcode: userDeliveryDetails.deliveryPostcode,
        deliveryProviderId: deliveryFee.providerId,
        deliveryType: deliveryOption.type
      }
    }

    return new Promise((resolve, reject) => {
      this.apiService.postConfirmCOD(data, data.cartId, false).subscribe((res: any) => {
        resolve(res);
        if (res.status === 201) {
          this.cart = [];
          this.removeCartId();
        }
      }, error => {
        console.error("Error confirming Cash on Delivery", error);
        reject(error);
      });
    })
  }


}
