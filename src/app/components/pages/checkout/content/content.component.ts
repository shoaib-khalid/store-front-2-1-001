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
import {
  DeliveryCharge,
  DeliveryDetails,
  DeliveryProvider,
  MarkerDragEvent,
} from "../../../models/delivery";
import { City, State } from "../../../models/region";
import { Store, StoreTiming } from "../../../models/store";
import { StoreService } from "../../../../store.service";
import Swal from "sweetalert2";
import { MatSelect } from "@angular/material/select";
import { MatFormField } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from "@angular/cdk/overlay/overlay-directives";
import { FormGroup } from "@angular/forms";
import { Order, PickupDetails } from "../../../models/pickup";
import {
  of,
  Observable,
} from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { MatDialog } from "@angular/material/dialog";
import { ChooseDeliveryAddressComponent } from "../choose-delivery-address/choose-delivery-address.component";
import { CustomerVoucher, Voucher } from "../../../models/voucher";

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
  deliveryProviders: DeliveryProvider[] = [];
  selectedDeliveryProvider: any;
  saveMyInfo: boolean = true

  voucherApplied: CustomerVoucher | null;

  isProcessing: boolean = false;
  hasDeliveryCharges: boolean = false;

  isError: boolean;
  allowsStorePickup: boolean = false;

  isDeliveryNameValid: boolean = true;
  isDeliveryAddressValid: boolean = true;
  isDeliveryCityValid: boolean = true;
  isDeliveryStateValid: boolean = true;
  isDeliveryPostCodeValid: boolean = true;
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
  dialingCode: string = '92';
  countryID: string;

  promoCode: string = ""
  guestVouchers: CustomerVoucher | null;
  redeemed: boolean = false;
  voucherDiscountAppliedMax: number;

  numberRegex;
  emailRegex;
  phoneNumberRegex;

  submitButtonText: string;
  isLoading: boolean;

  // Store info
  currencySymbol: string = "";
  states: State[] = [];
  cities: City[] = []
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
  // centerLatitude = this.lat;
  // centerLongitude = this.lng;
  searchElementRef: any;

  mapSearchService: google.maps.places.AutocompleteService;
  addressSearchPredictions: google.maps.places.QueryAutocompletePrediction[];
  isAddressLoading: boolean = false;

  mapsApiLoaded: Observable<boolean>;
  mapZoom: number = 6;
  mapCenter: google.maps.LatLngLiteral = {
    lat: 29.863823279065763,
    lng: 69.66914923422128,
  };
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true,
    scaleControl: true,
  };

  marker: google.maps.Marker;
  markerPosition: object;
  markerLabel: object;

  fetched: boolean = false

  constructor(
    private cartService: CartService,
    private storeService: StoreService,
    private route: Router,
    private apiService: ApiService,
    private ngZone: NgZone,
    private httpClient: HttpClient,
    private _dialog: MatDialog
  ) {
    this.mapsApiLoaded = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCFhf1LxbPWNQSDmxpfQlx69agW-I-xBIw&libraries=places',
        'callback'
      )
      .pipe(
        map(() => {
          this.mapSearchService =
            new google.maps.places.AutocompleteService();
          this.geoCoder = new google.maps.Geocoder
          return true;
        }),
        catchError(() => of(false))
      );
    this.numberRegex = /[0-9]+/;
    this.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    // this.phoneNumberRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s\.\/0-9]*$/;
    this.phoneNumberRegex = /^3[0-9]{9}/;
    this.submitButtonText = "Calculate Charges";

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
      deliveryNotes: ""
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

    this.storeService.getDeliveryOption().then((response) => {
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

    this.isProcessing = true;
    if (this.deliveryType === 1) {
      console.log("onSubmit");
      if (this.isDeliveryFieldsValid()) {
        // this.userDeliveryDetails.deliveryContactPhone = this.dialingCode + this.userDeliveryDetails.deliveryContactPhone

        const voucherCode = {
          platformVoucher:
            this.voucherApplied &&
              this.voucherApplied.voucher.voucherType === 'PLATFORM'
              ? this.voucherApplied.voucher.voucherCode
              : null,
          storeVoucher:
            this.voucherApplied &&
              this.voucherApplied.voucher.voucherType === 'STORE'
              ? this.voucherApplied.voucher.voucherCode
              : null,
        };

        const deliveryChargesBody = {
          deliveryContactName: this.userDeliveryDetails.deliveryContactName,
          deliveryAddress: this.userDeliveryDetails.deliveryAddress,
          deliveryPostcode: this.userDeliveryDetails.deliveryPostcode,
          deliveryContactEmail: this.userDeliveryDetails.deliveryContactEmail,
          deliveryContactPhone: this.userDeliveryDetails.deliveryContactPhone,
          deliveryState: this.userDeliveryDetails.deliveryState,
          deliveryCity: this.userDeliveryDetails.deliveryCity,
          deliveryCountry: this.userDeliveryDetails.deliveryCountry,
          deliveryNotes: this.userDeliveryDetails.deliveryNotes,
          latitude: this.lat,
          longitude: this.lng,
          voucherCode: voucherCode.platformVoucher,
          storeVoucherCode: voucherCode.storeVoucher,
        }
        deliveryChargesBody.deliveryContactPhone = this.dialingCode + deliveryChargesBody.deliveryContactPhone
        if (this.hasDeliveryCharges) {
          try {
            const codResult: any = await this.cartService.confirmCashOnDelivery(
              deliveryChargesBody,
              this.selectedDeliveryProvider,
              this.saveMyInfo
            );
            if (codResult.status === 201) {
              this.route.navigate(["/thankyou"]);
            } else {
              // TODO: Show error message
            }
          } catch {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "An error occuured",
              timer: 3000
            })
          }

        } else {
          try {
            this.deliveryProviders = await this.cartService.getDeliveryFee(
              deliveryChargesBody
            )
            if (this.deliveryProviders.length === 0) {
              Swal.fire({
                icon: "error",
                title: "Oops",
                text: "No available delivery provider",
                timer: 3000
              })
              return;
            } else if (this.deliveryProviders.length === 1) {
              if (this.deliveryProviders[0].isError) {
                Swal.fire({
                  icon: "error",
                  title: "Oops",
                  text: this.deliveryProviders[0].message,
                  timer: 3000
                })
                this.deliveryProviders = []
              }
            }
            // } else {
            //   this.submitButtonText = "Place Order";
            // }

          } catch {
            Swal.fire({
              icon: "error",
              title: "Ooops",
              text: "We can't deliver in your state.",
              timer: 3000,
            });
            console.log("Something went wrong. Try again");
          }
        }
      }
    } else if (this.deliveryType === 2) {
      if (this.hasDeliveryCharges) {
        if (this.isPickupFieldsValid()) {

          const voucherCode = {
            platformVoucher:
              this.voucherApplied &&
                this.voucherApplied.voucher.voucherType === 'PLATFORM'
                ? this.voucherApplied.voucher.voucherCode
                : null,
            storeVoucher:
              this.voucherApplied &&
                this.voucherApplied.voucher.voucherType === 'STORE'
                ? this.voucherApplied.voucher.voucherCode
                : null,
          };

          const pickupChargesBody = {
            pickupContactName: this.userPickupDetails.pickupContactName,
            pickupContactEmail: this.userPickupDetails.pickupContactEmail,
            pickupContactPhone: this.userPickupDetails.pickupContactPhone,
            pickupNotes: this.userPickupDetails.deliveryNotes,
            voucherCode: voucherCode.platformVoucher,
            storeVoucherCode: voucherCode.storeVoucher,
          }

          pickupChargesBody.pickupContactPhone = this.dialingCode + pickupChargesBody.pickupContactPhone
          console.log("USERORDER: ", this.userOrder);
          console.log("PickupDetails: ", this.userPickupDetails);
          const codResult: any = await this.cartService.getQuotation(
            this.userPickupDetails,
            this.saveMyInfo
          );
          if (codResult.status === 201) {
            this.route.navigate(["/thankyou"]);
          } else {
            // TODO: Show error message
          }
        }
      } else {
        const voucherCode = {
          platformVoucher:
            this.voucherApplied &&
              this.voucherApplied.voucher.voucherType ===
              'PLATFORM'
              ? this.voucherApplied.voucher.voucherCode
              : null,
          storeVoucher:
            this.voucherApplied &&
              this.voucherApplied.voucher.voucherType === 'STORE'
              ? this.voucherApplied.voucher.voucherCode
              : null,
        };

        let discountParams = {
          deliveryQuotationId: null,
          deliveryType: "PICKUP",
          voucherCode: voucherCode.platformVoucher,
          storeVoucherCode: voucherCode.storeVoucher,
          customerId: null,
          email: this.userPickupDetails.pickupContactEmail ? this.userPickupDetails.pickupContactEmail : null
        };

        this.cartService.getDiscount(discountParams).then((response: CartTotals) => {
          this.cartTotals = response
          this.hasDeliveryCharges = this.cartTotals ? true : false;
          this.submitButtonText = "Place Order";
        }, error => {
          Swal.fire({
            icon: "error",
            title: "Ooops",
            text: error.error.message,
            timer: 3000,
          });
          console.log("Something went wrong. Try again");
        })
        // this.cartTotals = await this.cartService.getDiscount(discountParams);
      }
    }
    this.isProcessing = false;
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

  getCitiesByStateID(deliveryStateID) {

    this.apiService.getCitiesByStateID(deliveryStateID, '', this.countryID).subscribe(
      async (res: any) => {
        if (res.status === 200) {
          this.cities = res.data
          // this.userDeliveryDetails.deliveryCity = this.cities.length > 0 ? this.cities[0].name : ''
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  searchAddress(): void {
    const address = this.userDeliveryDetails.deliveryAddress;
    this.addressSearchPredictions = [];
    this.mapSearchService.getPlacePredictions(
      { input: address },
      (
        predictions:
          | google.maps.places.QueryAutocompletePrediction[]
          | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          console.log('Status: ' + status);
          return;
        }
        this.addressSearchPredictions = predictions;
      }
    );
  }

  async onSelectDeliveryProvider() {
    this.isProcessing = true
    if (this.selectedDeliveryProvider.isError === true) {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: this.selectedDeliveryProvider.message,
        timer: 3000
      })
    } else {
      const voucherCode = {
        platformVoucher:
          this.voucherApplied &&
            this.voucherApplied.voucher.voucherType ===
            'PLATFORM'
            ? this.voucherApplied.voucher.voucherCode
            : null,
        storeVoucher:
          this.voucherApplied &&
            this.voucherApplied.voucher.voucherType === 'STORE'
            ? this.voucherApplied.voucher.voucherCode
            : null,
      };
      let discountParams = {
        deliveryType: this.selectedDeliveryProvider.deliveryType,
        deliveryQuotationId: this.selectedDeliveryProvider.refId,
        voucherCode: voucherCode.platformVoucher,
        storeVoucherCode: voucherCode.storeVoucher,
        customerId: null,
        email: this.userDeliveryDetails.deliveryContactEmail ? this.userDeliveryDetails.deliveryContactEmail : null
      };

      this.cartService.getDiscount(discountParams).then((response: CartTotals) => {
        this.cartTotals = response
        this.hasDeliveryCharges = this.cartTotals ? true : false;
        this.totalServiceCharge =
              this.storeDeliveryPercentage === 0
                ? this.storeDeliveryPercentage
                : (this.storeDeliveryPercentage / 100) *
                  this.cartTotals.cartSubTotal;
        this.submitButtonText = "Place Order";
      }, error => {
        Swal.fire({
          icon: "error",
          title: "Ooops",
          text: error.error.message,
          timer: 3000,
        });
        console.log("Something went wrong. Try again");
      })
      // this.isError = this.deliveryFee.isError;
      // this.totalServiceCharge =
      // this.storeDeliveryPercentage === 0
      //   ? this.storeDeliveryPercentage
      //   : (this.storeDeliveryPercentage / 100) *
      //     this.cartTotals.cartSubTotal;
    }
    this.isProcessing = false
  }

  onSelectAddress(
    selectedAddress: google.maps.places.QueryAutocompletePrediction
  ): void {
    this.addressSearchPredictions = []
    this.userDeliveryDetails.deliveryAddress = selectedAddress.description
    this.geoCoder
      .geocode({ address: selectedAddress.description }, (results, status) => {
        if (results && results[0]) {
          const location = results[0].geometry.location

          this.lat = location.lat()
          this.lng = location.lng()
          this.markerPosition = location
          this.markerLabel = {
            color: 'green',
            text: selectedAddress.description
          }

          this.mapCenter = {
            lat: location.lat(),
            lng: location.lng()
          }

          this.mapZoom = 12
        }
      })
  }

  onMapClicked(event: google.maps.MapMouseEvent): void {
    // if (this.checkoutForm.get('storePickup').value) return
    // this.marker.position.lat = event.latLng.lat();
    // this.marker.position.lng = event.latLng.lng();
    const coordinates = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    this.lat = coordinates.lat;
    this.lng = coordinates.lng;

    this.markerPosition = coordinates;

    this.fillAddressBar(coordinates);
  }

  fillAddressBar(coordinates: any): void {
    this.geoCoder.geocode({ location: coordinates }, (results, status) => {
      if (results && results[0]) {
        this.userDeliveryDetails.deliveryAddress = results[0].formatted_address
        this.markerLabel = {
          color: 'green',
          text: results[0].formatted_address
        }
      }
    })
  }

  //   allowPickupStore() {
  //     this.checkoutForm.get('storePickup').setValue(this.checkoutForm.get('storePickup').value);
  // }

  async getStoreInfo() {
    try {
      const storeInfo: Store = await this.storeService.getStoreInfo();
      this.store = storeInfo
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
      this.countryID = storeInfo.regionCountry.id
      this.states = await this.getStatesByID(this.countryID);
      this.storeTimings = storeInfo.storeTiming;
      switch (storeInfo.regionCountry.id) {
        case 'MYS':
          // this.userDeliveryDetails.deliveryState = 'Selangor'
          this.dialingCode = '60';
          break;
        case 'PAK':
          // this.userDeliveryDetails.deliveryState = 'Federal'
          this.dialingCode = '92';
          break;
      }
      // await this.getCitiesByStateID(this.userDeliveryDetails.deliveryState)
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

  // async getMap() {
  //   this.mapsAPILoader.load().then(() => {
  //     this.map = new google.maps.Map(
  //       document.getElementById("map") as HTMLElement
  //     );
  //     this.setCurrentLocation();
  //     this.geoCoder = new google.maps.Geocoder();
  //     let autocomplete = new google.maps.places.Autocomplete(
  //       this.searchElementRef.nativeElement
  //     );
  //     autocomplete.addListener("place_changed", () => {
  //       this.ngZone.run(() => {
  //         //get the place result
  //         let place: google.maps.places.PlaceResult = autocomplete.getPlace();

  //         //verify result
  //         if (place.geometry === undefined || place.geometry === null) {
  //           return;
  //         }
  //         //set latitude, longitude and zoom
  //         this.lat = place.geometry.location.lat();
  //         this.lng = place.geometry.location.lng();
  //         this.zoom = 12;
  //         // console.log('Location Entered', 'Lat' , this.latitude + ' Lng', this.longitude)
  //       });
  //     });
  //   });
  // }
  // private setCurrentLocation() {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.lat = position.coords.latitude;
  //       this.lng = position.coords.longitude;
  //       this.zoom = 8;
  //       //this.getAddress(this.lat, this.lng);
  //     });
  //   }
  // }
  // markerDragEnd($event: MouseEvent) {
  //   console.log($event);
  //   this.lat = $event.coords.lat;
  //   this.lng = $event.coords.lng;
  //   this.getAddress(this.lat, this.lng);
  //   // console.log('Marker Dragged',  'Lat' , this.latitude + ' Lng', this.longitude)
  // }
  // getAddress(lat: number, lng: number) {
  //   const geocoder = new google.maps.Geocoder();
  //   const latlng = new google.maps.LatLng(lat, lng);
  //   const request: any = {
  //     latLng: latlng,
  //   };
  //   return new Promise((resolve, reject) => {
  //     geocoder.geocode(request, (results) => {
  //       results.length ? resolve(results[0].formatted_address) : reject(null);
  //     });
  //   });
  // }

  // centerChange(coords: LatLngLiteral) {
  //   //console.log(event);
  //   this.centerLatitude = coords.lat;
  //   this.centerLongitude = coords.lng;
  // }

  // Validation
  isDeliveryFieldsValid(): boolean {
    console.log("validating delivery address: ", this.isDeliveryAddressValid);

    this.validateDeliveryName();
    this.validateDeliveryAddress();
    this.validateDeliveryCity();
    this.validateDeliveryState();
    this.validateDeliveryPostCode();
    this.validateDeliveryCountry();
    this.validateDeliveryPhoneNumber();
    this.validateDeliveryEmailAddress();

    return (
      this.isDeliveryNameValid &&
      this.isDeliveryAddressValid &&
      this.isDeliveryCityValid &&
      this.isDeliveryStateValid &&
      this.isDeliveryPostCodeValid &&
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

  validateDeliveryNameAlphabet(event) {

    let charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 32) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
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

  validateDeliveryPostCode(): boolean {
    const postCodeRegexMatch = this.userDeliveryDetails.deliveryPostcode.match(
      this.numberRegex
    );
    this.isDeliveryPostCodeValid = postCodeRegexMatch !== null;
    if (this.userDeliveryDetails.deliveryPostcode === "") {
      this.postCodeErrorMsg = "Postcode cannot be blank.";
    } else if (!postCodeRegexMatch) {
      this.postCodeErrorMsg = "Postcode must be a valid number";
    }
    return this.isDeliveryPostCodeValid;
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
    this.hasDeliveryCharges = false
    this.submitButtonText = "Calculate Charges";
    this.deliveryProviders = []
    this.deliveryType = 2;
    this.lat = this.store.latitude
    this.lng = this.store.longitude
    this.selectedDeliveryProvider = null
    this.onSubmit()
  }
  delivery() {
    this.submitButtonText = "Calculate Charges";
    this.deliveryProviders = []
    this.hasDeliveryCharges = false
    this.deliveryType = 1;
    this.selectedDeliveryProvider = null
  }

  getCustomerInfo(type, value) {
    if (value === "" || this.fetched) return

    const email = type === 'email' ? value : null;
    const phoneNumber = type === 'phoneNumber' ? this.dialingCode + value : null;

    this.cartService.getCustomerInfo(email, phoneNumber).then(response => {
      if (response && response.customerAddress.length > 0) {
        this.fetched = true
        let dialogRef = this._dialog.open(
          ChooseDeliveryAddressComponent,
          { disableClose: true, data: response }
        );

        dialogRef.afterClosed().subscribe((result) => {
          if (result.isAddress === true) {
            // this.checkoutForm.get('id').patchValue(response.id);
            this.userDeliveryDetails.deliveryContactName = result.name
            this.userDeliveryDetails.deliveryContactEmail = result.email
            this.userDeliveryDetails.deliveryContactPhone = result.phoneNumber.slice(-10)
            this.userDeliveryDetails.deliveryAddress = result.address
            this.userDeliveryDetails.deliveryPostcode = result.postCode.trim()
            this.userDeliveryDetails.deliveryState = result.state
            this.userDeliveryDetails.deliveryCity = result.city
            this.userDeliveryDetails.deliveryCountry = result.country
          }
        });
      }
    })
  }

  claimPromoCode() {
    if (this.promoCode === "") return;

    const email = this.deliveryType === 1 ? this.userDeliveryDetails.deliveryContactEmail : this.userPickupDetails.pickupContactEmail;

    if (email === "") {
      Swal.fire({
        icon: "warning",
        title: "Email address required",
        text: "Please add your email address to redeem the voucher.",
        timer: 3000
      })
    } else {
      this.cartService.verifyVoucher(email, this.promoCode).then((response: Voucher) => {
        if (response) {
          let voucher = response;
          this.promoCode = ""

          let indexVerticalList =
            voucher.voucherVerticalList.findIndex(
              (item) =>
                item.verticalCode ===
                this.store.verticalCode
            );
          let indexStoreList = voucher.voucherStoreList.findIndex(
            (item) => item.storeId === this.store.id
          );

          if (
            (voucher.voucherType === 'STORE'
              ? indexStoreList > -1
              : true) &&
            indexVerticalList > -1
          ) {
            Swal.fire({
              icon: "success",
              title: "Congratulations!",
              text: "Promo code successfully claimed",
              timer: 3000
            })

            this.isTwo = true
            this.redeemed = true

            this.guestVouchers = {
              id: "",
              customerId: "",
              voucherId: voucher.id,
              isUsed: false,
              created: "",
              voucher: voucher,
            };

            this.selectVoucher(this.guestVouchers);
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Promo code not valid for this store",
              timer: 3000
            })
          }
        }
      }, error => {
        if (error.error.message) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.error.message,
            timer: 3000
          })
        }
      })
    }
  }

  selectVoucher(voucher: CustomerVoucher) {
    this.voucherApplied = voucher

    this.voucherDiscountAppliedMax = voucher.voucher.discountValue

    this.submitButtonText = "Calculate Charges";
    this.deliveryProviders = []
    this.hasDeliveryCharges = false
    this.selectedDeliveryProvider = null

    if (this.deliveryType === 2) {
      this.onSubmit()
    }
  }

  deselectVoucher() {
    this.voucherApplied = null
    this.voucherDiscountAppliedMax = 0;
    this.guestVouchers = null;

    this.redeemed = false

    this.submitButtonText = "Calculate Charges";
    this.deliveryProviders = []
    this.hasDeliveryCharges = false
    this.selectedDeliveryProvider = null

    if (this.deliveryType === 2) {
      this.onSubmit()
    }
  }

}
