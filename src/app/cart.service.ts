import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { CartItem, CartItemRequest, CartTotals } from './components/models/cart';
import { DeliveryCharge, DeliveryDetails, DeliveryProvider } from './components/models/delivery';
import { Order, OrderShipmentDetails, PickupDetails } from './components/models/pickup';
import { Product, ProductInventory } from './components/models/product';
import { Store } from './components/models/store';
import { Customer } from './components/models/user';
import { Voucher } from './components/models/voucher';
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

  getDeliveryFee(DeliveryDetails: DeliveryDetails): Promise<DeliveryProvider[]> {
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
          resolve(res.data);
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

  getDiscount(params): Promise<CartTotals> {
    return new Promise((resolve, reject) => {
      let discountParams = {
        id: this.getCartId(),
        deliveryQuotationId: params.deliveryQuotationId,
        deliveryType: params.deliveryType,
        voucherCode: params.voucherCode,
        storeVoucherCode: params.storeVoucherCode,
        customerId: params.customerId,
        email: params.email ? params.email : undefined,
        storeId: this.storeService.getStoreId()
    };
      this.apiService.getDiscount(discountParams).subscribe(async (res: any) => {
        resolve(res.data);
      }, error => {
        console.error("Error getting discount", error);
        reject(error);
      })
    })
  }
  async getQuotation(pickupDetails: any, saveInfo){

    console.log("PICKUPDETAILS: ", pickupDetails);

    const data = {
      cartId: this.getCartId(),
      customerId: null,
      customerNotes: pickupDetails.deliveryNotes,
      voucherCode: pickupDetails.voucherCode,
      storeVoucherCode: pickupDetails.storeVoucherCode,
      orderPaymentDetails: {
        accountName: pickupDetails.pickupContactName,
        deliveryQuotationReferenceId: null,
      },
      orderShipmentDetails: {
        address: "",
        city: "",
        country: "",
        email: pickupDetails.pickupContactEmail,
        phoneNumber: pickupDetails.pickupContactPhone,
        receiverName: pickupDetails.pickupContactName,
        state: "",
        zipcode: "",
        deliveryProviderId: "",
        deliveryType: "PICKUP",
      }
    }
    console.log("details:" + data,data.cartId)
    return new Promise((resolve, reject) => {
      this.apiService.postConfirmCOD(data, data.cartId, saveInfo, this.storeService.getStoreId()).subscribe((res: any) => {
        resolve(res);
        if (res.status === 201) {
          this.removeCart();
        }
      }, error => {
        console.error("Error Placing Order", error);
        reject(error);
      });
    })

  }
  async confirmCashOnDelivery(deliveryChargesBody: any, deliveryProvider: DeliveryProvider, saveInfo) {
    // const deliveryOption: any = await this.storeService.getDeliveryOption();

    const data = {
      cartId: this.getCartId(),
      customerId: null,
      customerNotes: deliveryChargesBody.deliveryNotes,
      voucherCode: deliveryChargesBody.voucherCode,
      storeVoucherCode: deliveryChargesBody.storeVoucherCode,
      orderPaymentDetails: {
        accountName: deliveryChargesBody.deliveryContactName,
        deliveryQuotationReferenceId: deliveryProvider.refId,
      },
      orderShipmentDetails: {
        address: deliveryChargesBody.deliveryAddress,
        city: deliveryChargesBody.deliveryCity,
        country: deliveryChargesBody.deliveryCountry,
        email: deliveryChargesBody.deliveryContactEmail,
        phoneNumber: deliveryChargesBody.deliveryContactPhone,
        receiverName: deliveryChargesBody.deliveryContactName,
        state: deliveryChargesBody.deliveryState,
        zipcode: deliveryChargesBody.deliveryPostcode,
        deliveryProviderId: deliveryProvider.providerId,
        deliveryType: deliveryProvider.deliveryType
      }
    }

    return new Promise((resolve, reject) => {
      this.apiService.postConfirmCOD(data, data.cartId, saveInfo, this.storeService.getStoreId()).subscribe((res: any) => {
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

  async getCustomerInfo(email: string | null, phoneNumber: string | null): Promise<Customer> {
    const value = email === null ? phoneNumber : email
    const type = email === null ? 'phoneNumber' : 'email'

    return new Promise((resolve, reject) => {
      this.apiService.getCustomerInfo(this.storeService.getStoreId(), type, value).subscribe((res: any) => {
        resolve(res.data.content[0])
      }, error => {
          console.error("Error getting Customer Info", error);
          reject(error);
      })
    })
  }

  async verifyVoucher(customerEmail, voucherCode): Promise<Voucher> {
    return new Promise((resolve, reject) => {
      this.apiService.verifyVoucher(voucherCode, this.storeService.getStoreId(), customerEmail).subscribe((res: any) => {
        resolve(res.data);
      }, error => {
        console.error("Error verifying Voucher", error);
        reject(error);
      }
      )
    })
  }
}
