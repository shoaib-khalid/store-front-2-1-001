import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { CartService } from 'src/app/cart.service';
import { CartItem, CartTotals } from 'src/app/components/models/cart';
import { DeliveryCharge } from 'src/app/components/models/delivery';
import { State } from 'src/app/components/models/region';
import { StoreInfo } from 'src/app/components/models/store';
import { UserDeliveryDetail } from 'src/app/components/models/userDeliveryDetail';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  checkout: CartItem[];
  userDeliveryDetails: UserDeliveryDetail = {
    deliveryContactName: '',
    deliveryAddress: '',
    deliveryPostcode: '',
    deliveryContactEmail: '',
    deliveryContactPhone: '',
    deliveryState: '',
    deliveryCity: '',
    deliveryCountry: '',
    deliveryNotes: ''
  };
  cartTotals: CartTotals = null;
  deliveryFee: DeliveryCharge = null;
  isSaved: boolean = false;

  isProcessing: boolean = false;
  hasDeliveryCharges: boolean = false;

  isNameValid: boolean = true;
  isAddressValid: boolean = true;
  isCityValid: boolean = true;
  isStateValid: boolean = true;
  isPostCodeValid: boolean = true;
  isCountryValid: boolean = true;
  isPhoneNumberValid: boolean = true;
  isEmailValid: boolean = true;

  phoneNumberErrorMsg: string;
  emailErrorMsg: string;
  postCodeErrorMsg: string;
  status: any;

  numberRegex;
  emailRegex;
  phoneNumberRegex;

  submitButtonText: string;

  // Store info
  storeId: string;
  currencySymbol: string = "";
  states: State[] = [];
  storeDeliveryPercentage: number;

  totalServiceCharge: number;

  constructor(
    private cartService: CartService,
    private route: Router,
    private apiService: ApiService
  ) {
    this.storeId = "McD";
    this.numberRegex = /[0-9]+/;
    this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.phoneNumberRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s\.\/0-9]*$/;
    this.submitButtonText = "Get Delivery Charges";
  }
  public isOne = true;
  public isTwo = true;
  public calculateSubtotal() {
    return this.cartService.getSubTotal();
  };
  ngOnInit(): void {
    this.checkout = this.cartService.cart;
    this.getStoreInfo();
    this.cartService.cartChange.subscribe(cart => {
      this.checkout = cart;
    });
  }

  selectState(e): void {
    this.userDeliveryDetails.deliveryState = e.target.value;
  }

  async onSubmit() {
    if (this.isAllFieldsValid()) {
      this.isProcessing = true;
      if (this.hasDeliveryCharges) {
        const codResult: any = await this.cartService.confirmCashOnDelivery(
          this.userDeliveryDetails, this.deliveryFee);
        if (codResult.status === 201) {
          this.route.navigate(['/thankyou']);
        } else {
          // TODO: Show error message
        }
      } else {
        this.deliveryFee = await this.cartService.getDeliveryFee(this.userDeliveryDetails);
        this.cartTotals = await this.cartService.getDiscount(this.deliveryFee.price);

        this.hasDeliveryCharges = this.cartTotals ? true : false;
        this.totalServiceCharge = this.storeDeliveryPercentage === 0 ? this.storeDeliveryPercentage :
          ((this.storeDeliveryPercentage / 100) * this.cartTotals.cartSubTotal);
        this.submitButtonText = "Place Order";
      }
      this.isProcessing = false;
    }
  }

  getStatesByID(countryID): Promise<State[]> {
    return new Promise(resolve => {
      this.apiService.getStateByCountryID(countryID).subscribe(async (res: any) => {
        if (res.status === 200) {
          resolve(res.data.content)
        } else {
          console.log('getStateByCountryID operation failed')
        }
      }, error => {
        console.error(error);
        resolve(error);
      })
    })
  }

  async getStoreInfo() {
    try {
      const storeInfo: StoreInfo = await this.cartService.getStoreInfoById();
      this.currencySymbol = storeInfo.regionCountry.currencySymbol;
      this.userDeliveryDetails.deliveryCountry = storeInfo.regionCountry.name;
      this.storeDeliveryPercentage = storeInfo.serviceChargesPercentage;

      this.states = await this.getStatesByID(storeInfo.regionCountry.id);
    } catch (error) {
      console.error("Error getting storeInfo", error);
    }
  }

  // Validation
  isAllFieldsValid(): boolean {
    this.validateName();
    this.validateAddress();
    this.validateCity();
    this.validateState();
    this.validatePostCode();
    this.validateCountry();
    this.validatePhoneNumber();
    this.validateEmailAddress();

    return this.isNameValid && this.isAddressValid && this.isCityValid && this.isStateValid &&
      this.isPostCodeValid && this.isCountryValid && this.isPhoneNumberValid && this.isEmailValid;
  }

  validateName(): boolean {
    this.isNameValid = this.userDeliveryDetails.deliveryContactName !== '';
    return this.isNameValid;
  }

  validateAddress(): boolean {
    this.isAddressValid = this.userDeliveryDetails.deliveryAddress !== '';
    return this.isAddressValid;
  }

  validateCity(): boolean {
    this.isCityValid = this.userDeliveryDetails.deliveryCity !== '';
    return this.isCityValid;
  }

  validateState(): boolean {
    this.isStateValid = this.userDeliveryDetails.deliveryState !== '';
    return this.isStateValid;
  }

  validateCountry(): boolean {
    this.isCountryValid = this.userDeliveryDetails.deliveryCountry !== '';
    return this.isCountryValid;
  }

  validatePostCode(): boolean {
    const postCodeRegexMatch = this.userDeliveryDetails.deliveryPostcode.match(this.numberRegex);
    this.isPostCodeValid = postCodeRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryPostcode === '') {
      this.postCodeErrorMsg = "Postcode cannot be blank.";
    } else if (!postCodeRegexMatch) {
      this.postCodeErrorMsg = "Postcode must be a valid number";
    }
    return this.isPostCodeValid;
  }

  validatePhoneNumber(): boolean {
    const phoneRegexMatch = this.userDeliveryDetails.deliveryContactPhone.match(this.phoneNumberRegex);
    this.isPhoneNumberValid = phoneRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryContactPhone === '') {
      this.phoneNumberErrorMsg = "Phone number cannot be blank.";
    } else if (!phoneRegexMatch) {
      this.phoneNumberErrorMsg = "Not a valid phone number.";
    }
    return this.isPhoneNumberValid;
  }

  validateEmailAddress(): boolean {
    const emailRegexMatch = this.userDeliveryDetails.deliveryContactEmail.match(this.emailRegex);
    this.isEmailValid = emailRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryContactEmail === '') {
      this.emailErrorMsg = "Email address cannot be blank.";
    } else if (!emailRegexMatch) {
      this.emailErrorMsg = "Not a valid email address."
    }
    return this.isEmailValid;
  }
}
