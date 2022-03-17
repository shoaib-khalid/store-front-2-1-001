import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../../../api.service";
import { CartService } from "../../../../cart.service";
import { CartItem, CartTotals } from "../../../models/cart";
import { DeliveryCharge, DeliveryDetails } from "../../../models/delivery";
import { State } from "../../../models/region";
import { Store, StoreTiming } from "../../../models/store";
import { StoreService } from "../../../../store.service";
import Swal from "sweetalert2";
import { MatSelect } from "@angular/material/select";
import { MatFormField } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from "@angular/cdk/overlay/overlay-directives";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"],
})
export class ContentComponent implements OnInit {
  checkout: CartItem[];
  userDeliveryDetails: DeliveryDetails;
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
  isLoading: boolean;

  // Store info
  currencySymbol: string = "";
  states: State[] = [];
  storeDeliveryPercentage: number;

  storeTiming: StoreTiming[];
  dayArr = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  store_close: boolean = false;

  totalServiceCharge: number;
  storeTimings: any;

  constructor(
    private cartService: CartService,
    private storeService: StoreService,
    private route: Router,
    private apiService: ApiService
  ) {
    this.numberRegex = /[0-9]+/;
    this.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.phoneNumberRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s\.\/0-9]*$/;
    this.submitButtonText = "Get Delivery Charges";
    this.userDeliveryDetails = {
      deliveryContactName: "",
      deliveryAddress: "",
      deliveryPostcode: "",
      deliveryContactEmail: "",
      deliveryContactPhone: "",
      deliveryState: "",
      deliveryCity: "",
      deliveryCountry: "",
      deliveryNotes: "",
    };
  }
  public isOne = true;
  public isTwo = true;
  public calculateSubtotal() {
    return this.cartService.getSubTotal();
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.checkout = this.cartService.cart;
    this.getStoreInfo();
    this.cartService.cartChange.subscribe((cart) => {
      this.checkout = cart;
    });
    this.isLoading = false;
  }

  selectState(e): void {
    console.log()
    this.userDeliveryDetails.deliveryState = e.id;
    console.log("selectState: ", this.userDeliveryDetails.deliveryState);
  }

  async onSubmit() {
    if (this.isAllFieldsValid()) {
      this.isProcessing = true;
      if (this.hasDeliveryCharges) {
        const codResult: any = await this.cartService.confirmCashOnDelivery(
          this.userDeliveryDetails,
          this.deliveryFee
        );
        if (codResult.status === 201) {
          this.route.navigate(["/thankyou"]);
        } else {
          // TODO: Show error message
        }
      } else {
        try{
        this.deliveryFee = await this.cartService.getDeliveryFee(
          this.userDeliveryDetails
        );
        this.cartTotals = await this.cartService.getDiscount(
          this.deliveryFee.price
        );

        this.hasDeliveryCharges = this.cartTotals ? true : false;
        this.totalServiceCharge =
          this.storeDeliveryPercentage === 0
            ? this.storeDeliveryPercentage
            : (this.storeDeliveryPercentage / 100) *
              this.cartTotals.cartSubTotal;
            }
            catch{
              Swal.fire({
                icon: "error",
                title: "Ooops",
                text: "We can't deliver in your state.",
                timer: 3000,
              });
              console.log('Something went wrong. Try again')
            }
        this.submitButtonText = "Place Order";
      }
      this.isProcessing = false;
    }
  }

  getStatesByID(countryID): Promise<State[]> {
    return new Promise((resolve) => {
      this.apiService.getStateByCountryID(countryID).subscribe(
        async (res: any) => {
          if (res.status === 200) {
            resolve(res.data.content);
          }
        },
        (error) => {
          console.error(error);
          resolve(error);
        }
      );
    });
  }

  async getStoreInfo() {
    try {
      const storeInfo: Store = await this.storeService.getStoreInfo();
      this.currencySymbol = storeInfo.regionCountry.currencySymbol;
      this.userDeliveryDetails.deliveryCountry = storeInfo.regionCountry.name;
      this.storeDeliveryPercentage = storeInfo.serviceChargesPercentage;
      this.states = await this.getStatesByID(storeInfo.regionCountry.id);
      this.storeTimings = storeInfo.storeTiming;
      const currentDate = new Date();
      let todayDay = this.dayArr[currentDate.getDay()];
      let browserTime = new Date();
      for (let item of this.storeTimings){
        let dayObj = item.day;
        if ( dayObj == todayDay){
          let isOff = item.isOff;
          if(isOff == false){
            let openTime = new Date();
            openTime.setHours(item.openTime.split(":")[0], item.openTime.split(":")[1], 0);
            let closeTime = new Date();
            closeTime.setHours(item.closeTime.split(":")[0], item.closeTime.split(":")[1], 0);
            if (browserTime >= openTime && browserTime < closeTime) {
              
            } else {
              this.store_close = true;
            }
          } else {
            this.store_close = true;}
        }
      }      
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

    return (
      this.isNameValid &&
      this.isAddressValid &&
      this.isCityValid &&
      this.isStateValid &&
      this.isPostCodeValid &&
      this.isCountryValid &&
      this.isPhoneNumberValid &&
      this.isEmailValid
    );
  }

  validateName(): boolean {
    this.isNameValid = this.userDeliveryDetails.deliveryContactName !== "";
    return this.isNameValid;
  }

  validateAddress(): boolean {
    this.isAddressValid = this.userDeliveryDetails.deliveryAddress !== "";
    return this.isAddressValid;
  }

  validateCity(): boolean {
    this.isCityValid = this.userDeliveryDetails.deliveryCity !== "";
    return this.isCityValid;
  }

  validateState(): boolean {
    console.log("onStateSelect, ", this.userDeliveryDetails.deliveryState);
    return this.userDeliveryDetails.deliveryState !== "";
  }

  validateCountry(): boolean {
    return this.userDeliveryDetails.deliveryCountry !== "";
  }

  validatePostCode(): boolean {
    const postCodeRegexMatch = this.userDeliveryDetails.deliveryPostcode.match(
      this.numberRegex
    );
    this.isPostCodeValid = postCodeRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryPostcode === "") {
      this.postCodeErrorMsg = "Postcode cannot be blank.";
    } else if (!postCodeRegexMatch) {
      this.postCodeErrorMsg = "Postcode must be a valid number";
    }
    return this.isPostCodeValid;
  }

  validatePhoneNumber(): boolean {
    const phoneRegexMatch = this.userDeliveryDetails.deliveryContactPhone.match(
      this.phoneNumberRegex
    );
    this.isPhoneNumberValid = phoneRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryContactPhone === "") {
      this.phoneNumberErrorMsg = "Phone number cannot be blank.";
    } else if (!phoneRegexMatch) {
      this.phoneNumberErrorMsg = "Not a valid phone number.";
    }
    return this.isPhoneNumberValid;
  }

  validateEmailAddress(): boolean {
    const emailRegexMatch = this.userDeliveryDetails.deliveryContactEmail.match(
      this.emailRegex
    );
    this.isEmailValid = emailRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryContactEmail === "") {
      this.emailErrorMsg = "Email address cannot be blank.";
    } else if (!emailRegexMatch) {
      this.emailErrorMsg = "Not a valid email address.";
    }
    return this.isEmailValid;
  }
}
