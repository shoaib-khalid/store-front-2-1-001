import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../../../api.service";
import { CartService } from "../../../../cart.service";
import { CartItem, CartTotals } from "../../../models/cart";
import { DeliveryCharge, DeliveryDetails, MarkerDragEvent } from "../../../models/delivery";
import { State } from "../../../models/region";
import { Store, StoreTiming } from "../../../models/store";
import { StoreService } from "../../../../store.service";
import Swal from "sweetalert2";
import { MatSelect } from "@angular/material/select";
import { MatFormField } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from "@angular/cdk/overlay/overlay-directives";
import { FormGroup } from "@angular/forms";
import { Order, PickupDetails } from "../../../models/pickup";
import { LatLngLiteral, MapsAPILoader, Marker, MouseEvent } from "@agm/core";
import { map } from "jquery";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"],
})
export class ContentComponent implements OnInit {
  store: Store;
  checkout: CartItem[];
  userDeliveryDetails: DeliveryDetails;
  // markerDragEvent: MarkerDragEvent;
  userPickupDetails: PickupDetails;
  cartTotals: CartTotals;
  deliveryFee: DeliveryCharge;
  isSaved: boolean = false;

  isProcessing: boolean = false;
  hasDeliveryCharges: boolean = false;

  isError: boolean;
  allowsStorePickup: boolean = false;

  isDeliveryNameValid: boolean = true;
  isDeliveryAddressValid: boolean = true;
  isDeliveryCityValid: boolean = true;
  isDeliveryStateValid: boolean = true;
  isDeliveryPostcodeValid: boolean = true;
  isDeliveryCountryValid: boolean = true;
  isDeliveryPhoneNumberValid: boolean = true;
  isDeliveryEmailAddressValid: boolean = true;

  isPickupNameValid: boolean = true;
  isPickupEmailAddressValid: boolean = true;
  isPickupPhoneNumberValid: boolean = true;

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
  dayArr = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  store_close: boolean = false;
  totalServiceCharge: number;
  storeTimings: any;
  checkoutForm: FormGroup;
  
 //Radio
 deliveryType = 1;
  getStoreByDomainName: any;
  storeNameRaw: any;
  storeContact: any;
  storeAddress: string;
  storeEmail: string;
  postcode: string;
  city: string;
  countryName: string;
  stateId: string;
  submitButtonText2: string;
  userOrder: Order;
  isEmailValid2: boolean;
  isPhoneNumberValid2: boolean;
  
 // Map
 countryId: String;
  isNameValid2: boolean;
  zoom: number = 5;
  lat: number = 30.3753;
  lng: number = 69.3451; 
  markers: any;
  geoCoder: google.maps.Geocoder;
  map: google.maps.Map<HTMLElement>;
  address: string;
  centerLatitude = this.lat;
  centerLongitude = this.lng;
  searchElementRef: any;
  constructor(
    private cartService: CartService,
    private storeService: StoreService,
    private route: Router,
    private apiService: ApiService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.numberRegex = /[0-9]+/;
    this.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.phoneNumberRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s\.\/0-9]*$/;
    this.submitButtonText = "Get Delivery Charges";
    this.submitButtonText2 = "Calculate Charges";

    this.userPickupDetails = {
      pickupContactName: "",
      pickupContactEmail: "",
      pickupContactPhone: "",
      deliveryNotes: "",
    };

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
      deliveryPickup: {latitude: this.lat, longitude: this.lng}
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
    
    this.storeService.getDeliveryOption().then(response => {
      this.allowsStorePickup = response.allowsStorePickup;
    });
    this.getStoreInfo();
    this.cartService.cartChange.subscribe((cart) => {
      this.checkout = cart;
      1;
    });
    this.isLoading = false;
  }

  selectState(e): void {
    console.log();
    this.userDeliveryDetails.deliveryState = e.id;
    console.log("selectState: ", this.userDeliveryDetails.deliveryState);
  }

  async onSubmit() {
    if (this.deliveryType === 1) {
      console.log("onSubmit");
      if (this.isDeliveryFieldsValid()) {
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
          try {
            this.deliveryFee = await this.cartService.getDeliveryFee(
              this.userDeliveryDetails
            );
            this.cartTotals = await this.cartService.getDiscount(
              this.deliveryFee.price
            );
            this.hasDeliveryCharges = this.cartTotals ? true : false;
            this.isError = this.deliveryFee.isError;
            this.totalServiceCharge =
              this.storeDeliveryPercentage === 0
                ? this.storeDeliveryPercentage
                : (this.storeDeliveryPercentage / 100) *
                  this.cartTotals.cartSubTotal;
          } catch {
            Swal.fire({
              icon: "error",
              title: "Ooops",
              text: "We can't deliver in your state.",
              timer: 3000,
            });
            console.log("Something went wrong. Try again");
          }
          this.submitButtonText = "Place Order";
        }
        this.isProcessing = false;
      }
    } else if (this.deliveryType === 2) {
      if (this.isPickupFieldsValid()) {
        this.isProcessing = true;
        if (this.hasDeliveryCharges) {
          console.log("USERORDER: ", this.userOrder);
          console.log("PickupDetails: ", this.userPickupDetails);
          const codResult: any = await this.cartService.getQuotation(
            this.userPickupDetails
          );
          if (codResult.status === 201) {
            this.route.navigate(["/thankyou"]);
          } else {
            // TODO: Show error message
          }
        } else {
          this.cartTotals = await this.cartService.getDiscount(0);

          this.hasDeliveryCharges = this.cartTotals ? true : false;

          this.submitButtonText2 = "Place Order";
        }
        this.isProcessing = false;
      }
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

  //   allowPickupStore() {
  //     this.checkoutForm.get('storePickup').setValue(this.checkoutForm.get('storePickup').value);
  // }

  async getStoreInfo() {
    try {
      const storeInfo: Store = await this.storeService.getStoreInfo();
      this.storeNameRaw = storeInfo.name;
      this.storeContact = storeInfo.phoneNumber;
      this.storeAddress = storeInfo.address;
      this.storeEmail = storeInfo.email;
      this.postcode = storeInfo.postcode;
      this.city = storeInfo.city;
      this.stateId = storeInfo.regionCountryStateId;
      this.countryName = storeInfo.regionCountry.name;
      this.currencySymbol = storeInfo.regionCountry.currencySymbol;
      this.userDeliveryDetails.deliveryCountry = storeInfo.regionCountry.name;
      this.storeDeliveryPercentage = storeInfo.serviceChargesPercentage;
      this.states = await this.getStatesByID(storeInfo.regionCountry.id);
      this.storeTimings = storeInfo.storeTiming;
      const currentDate = new Date();
      let todayDay = this.dayArr[currentDate.getDay()];
      let browserTime = new Date();
      for (let item of this.storeTimings) {
        let dayObj = item.day;
        if (dayObj == todayDay) {
          let isOff = item.isOff;
          if (isOff == false) {
            let openTime = new Date();
            openTime.setHours(
              item.openTime.split(":")[0],
              item.openTime.split(":")[1],
              0
            );
            let closeTime = new Date();
            closeTime.setHours(
              item.closeTime.split(":")[0],
              item.closeTime.split(":")[1],
              0
            );
            if (browserTime >= openTime && browserTime < closeTime) {
            } else {
              this.store_close = true;
            }
          } else {
            this.store_close = true;
          }
        }
      }
    } catch (error) {
      console.error("Error getting storeInfo", error);
    }
  }
  
  async getMap(){
    this.mapsAPILoader.load().then(() => {
      this.map = new google.maps.Map(
        document.getElementById("map") as HTMLElement 
      );
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
              //verify result
              if (place.geometry === undefined || place.geometry === null) {
              return;
              }
              //set latitude, longitude and zoom
              this.lat = place.geometry.location.lat();
              this.lng = place.geometry.location.lng();
              this.zoom = 12;
              // console.log('Location Entered', 'Lat' , this.latitude + ' Lng', this.longitude)
          });
      });
    });
  }
  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 8;
        //this.getAddress(this.lat, this.lng);
      });
  }
}
  markerDragEnd($event: MouseEvent){
    console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
    // console.log('Marker Dragged',  'Lat' , this.latitude + ' Lng', this.longitude)
  }
  getAddress(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
    const request: any = {
      latLng: latlng
    }
    return new Promise((resolve, reject) => {
      geocoder.geocode(request, results => {
        results.length ? resolve(results[0].formatted_address) : reject(null);
      });
    })
 }
 
  centerChange(coords: LatLngLiteral) {
    //console.log(event);
    this.centerLatitude = coords.lat;
    this.centerLongitude = coords.lng;
  }

  // Validation
  isDeliveryFieldsValid(): boolean {
    console.log("validating delivery address: ", this.isDeliveryAddressValid);

    this.validateDeliveryName();
    this.validateDeliveryAddress();
    this.validateDeliveryCity();
    this.validateDeliveryState();
    this.validateDeliveryPostcode();
    this.validateDeliveryCountry();
    this.validateDeliveryPhoneNumber();
    this.validateDeliveryEmailAddress();

    return (
      this.isDeliveryNameValid &&
      this.isDeliveryAddressValid &&
      this.isDeliveryCityValid &&
      this.isDeliveryStateValid &&
      this.isDeliveryPostcodeValid &&
      this.isDeliveryCountryValid &&
      this.isDeliveryPhoneNumberValid &&
      this.isDeliveryEmailAddressValid
    );
  }

  isPickupFieldsValid(): boolean {
    this.validatePickupEmailAddress();
    this.validatePickupName();
    this.validatePickupPhoneNumber();

    return (
      this.isPickupEmailAddressValid &&
      this.isPickupNameValid &&
      this.isPickupPhoneNumberValid
    );
  }

  validateDeliveryName(): boolean {
    this.isDeliveryNameValid =
      this.userDeliveryDetails.deliveryContactName !== "";
    return this.isDeliveryNameValid;
  }

  validatePickupName(): boolean {
    this.isPickupNameValid = this.userPickupDetails.pickupContactName !== "";

    return this.isPickupNameValid;
  }

  validateDeliveryAddress(): boolean {
    this.isDeliveryAddressValid =
      this.userDeliveryDetails.deliveryAddress !== "";
    return this.isDeliveryAddressValid;
  }

  validateDeliveryCity(): boolean {
    this.isDeliveryCityValid = this.userDeliveryDetails.deliveryCity !== "";
    return this.isDeliveryCityValid;
  }

  validateDeliveryState(): boolean {
    this.isDeliveryStateValid = this.userDeliveryDetails.deliveryState !== "";
    return this.isDeliveryStateValid;
  }

  validateDeliveryCountry(): boolean {
    return this.userDeliveryDetails.deliveryCountry !== "";
  }

  validateDeliveryPostcode(): boolean {
    const postCodeRegexMatch = this.userDeliveryDetails.deliveryPostcode.match(
      this.numberRegex
    );
    this.isDeliveryPostcodeValid = postCodeRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryPostcode === "") {
      this.postCodeErrorMsg = "Postcode cannot be blank.";
    } else if (!postCodeRegexMatch) {
      this.postCodeErrorMsg = "Postcode must be a valid number";
    }
    return this.isDeliveryPostcodeValid;
  }

  validateDeliveryPhoneNumber(): boolean {
    const phoneRegexMatch = this.userDeliveryDetails.deliveryContactPhone.match(
      this.phoneNumberRegex
    );
    this.isDeliveryPhoneNumberValid = phoneRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryContactPhone === "") {
      this.phoneNumberErrorMsg = "Phone number cannot be blank.";
    } else if (!phoneRegexMatch) {
      this.phoneNumberErrorMsg = "Not a valid phone number.";
    }
    return this.isDeliveryPhoneNumberValid;
  }

  validatePickupPhoneNumber(): boolean {
    const phoneRegexMatch = this.userPickupDetails.pickupContactPhone.match(
      this.phoneNumberRegex
    );
    this.isPickupPhoneNumberValid = phoneRegexMatch !== null;
    console.log("pickupPhoneNumberValid:", this.isPickupPhoneNumberValid);
    if (this.userPickupDetails.pickupContactPhone === "") {
      this.phoneNumberErrorMsg = "Phone number cannot be blank.";
    } else if (!phoneRegexMatch) {
      this.phoneNumberErrorMsg = "Not a valid phone number.";
    }
    return this.isPickupPhoneNumberValid;
  }

  validateDeliveryEmailAddress(): boolean {
    const emailRegexMatch = this.userDeliveryDetails.deliveryContactEmail.match(
      this.emailRegex
    );
    this.isDeliveryEmailAddressValid = emailRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryContactEmail === "") {
      this.emailErrorMsg = "Email address cannot be blank.";
    } else if (!emailRegexMatch) {
      this.emailErrorMsg = "Not a valid email address.";
    }
    return this.isDeliveryEmailAddressValid;
  }

  validatePickupEmailAddress(): boolean {
    const emailRegexMatch = this.userPickupDetails.pickupContactEmail.match(
      this.emailRegex
    );
    this.isPickupEmailAddressValid = emailRegexMatch !== null;
    if (this.userPickupDetails.pickupContactEmail === "") {
      this.emailErrorMsg = "Email address cannot be blank.";
    } else if (!emailRegexMatch) {
      this.emailErrorMsg = "Not a valid email address.";
    }
    return this.isPickupEmailAddressValid;
  }

  pickup() {
    this.deliveryType = 2;
  }
  delivery() {
    this.deliveryType = 1;
  }
}
