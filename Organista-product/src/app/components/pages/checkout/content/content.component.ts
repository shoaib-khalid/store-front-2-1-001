import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/cart.service';
import { CartItem } from 'src/app/components/models/cart';
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
    deliveryCountry: ''
  };
  isPlacingOrder: boolean = false;

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

  numberRegex;
  emailRegex;
  phoneNumberRegex;

  constructor(
    private cartService: CartService,
    private route: Router
  ) {
    this.numberRegex = /[0-9]+/;
    this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.phoneNumberRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s\.\/0-9]*$/;
  }
  public isOne = true;
  public isTwo = true;
  public calculateprice() {
    return this.cartService.getGrandTotal();
  };
  ngOnInit(): void {
    this.checkout = this.cartService.cart;
    this.cartService.cartChange.subscribe(cart => { this.checkout = cart; });
  }

  selectCountry(e): void {
    this.userDeliveryDetails.deliveryCountry = e.target.value;
    this.validateCountry();
  }

  onSubmit(): void {
    this.isPlacingOrder = true;

    if (this.allFieldsValid()) {
      this.postGetDelivery();
    }
  }

  async postGetDelivery() {
    this.isPlacingOrder = true;
    const delivery: any = await this.cartService.postGetDelivery(this.userDeliveryDetails);
    if (delivery.status === 200) {
      this.route.navigate(['/thankyou']);
    }
    this.isPlacingOrder = false;
    console.log("Delivery data", delivery);
  }

  allFieldsValid(): boolean {
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
