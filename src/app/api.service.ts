import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PlatformLocation } from "@angular/common";
import { Category } from "./components/models/category";
import { Observable } from "rxjs";
import { AppConfig } from "./app.config";
import { isDevMode } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  token: any = "accessToken";

  variantStr: string;
  tokenPay: any;

  deliveryServiceURL: string;
  payServiceURL: string;
  userServiceURL: string;
  orderServiceURL: string;
  productServiceURL: any;

  constructor(
    private http: HttpClient,
    private platformLocation: PlatformLocation
  ) {
    this.getBaseUrls();
  }
  getBaseUrls() {
    try {
      this.userServiceURL = AppConfig.settings.serviceUrl.userServiceURL;
      this.productServiceURL = AppConfig.settings.serviceUrl.productServiceURL;
      this.orderServiceURL = AppConfig.settings.serviceUrl.orderServiceURL;
      this.deliveryServiceURL =
        AppConfig.settings.serviceUrl.deliveryServiceURL;
      this.payServiceURL = AppConfig.settings.serviceUrl.payServiceURL;
    } catch (ex) {
      console.error(
        "Failed to get API baseURLs from config file. Assigning hardcoded values instead.",
        ex
      );
      let currBaseUrl = location.origin;
      let splitUrl = currBaseUrl.split(".");
      if (splitUrl.length === 3) {
        this.userServiceURL = "https://api.symplified.biz/user-service/v1/";
        this.productServiceURL =
          "https://api.symplified.biz/product-service/v1/";
        this.payServiceURL = "https://api.symplified.biz/payment-service/v1/";
        this.orderServiceURL = "https://api.symplified.biz/order-service/v1/";
        this.deliveryServiceURL =
          "https://api.symplified.biz/delivery-service/v1/";
      } else {
        this.userServiceURL = "https://api.symplified.it/user-service/v1/";
        this.productServiceURL =
          "https://api.symplified.it/product-service/v1/";
        this.orderServiceURL = "https://api.symplified.it/order-service/v1/";
        this.deliveryServiceURL =
          "https://api.symplified.it/delivery-service/v1/";
      }
    }
  }
  postAuthenticate(data) {
    return this.http.post(this.userServiceURL + "clients/authenticate", data);
  }

  // Ref : http://209.58.160.20:1201/stores/8913d06f-a63f-4a16-8059-2a30a517663a/customers/?email=mwaqassh%40gmail.com&page=0&pageSize=20
  getCustomerProfileByEmail(email, storeId) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    const url =
      this.userServiceURL +
      "stores/" +
      storeId +
      "/customers/?email=" +
      email +
      "&storeId=" +
      storeId +
      "&page=0" +
      "&pageSize=20";
    return this.http.get(url, header);
  }

  getCustomerProfileByMsisdn(msisdn, storeId) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    const url =
      this.userServiceURL +
      "stores/" +
      storeId +
      "/customers/?phoneNumber=" +
      msisdn +
      "&storeId=" +
      storeId +
      "&page=0" +
      "&pageSize=20";
    return this.http.get(url, header);
  }

  // Ref : http://209.58.160.20:20921/swagger-ui/index.html?configUrl=/v3/api-docs/swagger-config#/customer-address-controller/getCustomerAddresss
  getCustomerProfileById(uuid) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };

    const url =
      this.userServiceURL +
      "customer/" +
      uuid +
      "/address/?" +
      "page=0" +
      "&pageSize=20";

    // https://api.symplified.biz/v1/user-service/customer/acedr-uvbhnhk-okpbfk-jvhcxxg/address/?page=0&pageSize=20

    return this.http.get(url, header);
  }

  // ===============
  // product service
  // ===============

  // Ref : http://209.58.160.20:7071/swagger-ui.html#/store-asset-controller/getStoreAssetsUsingGET
  getStoreAssets(storeID) {
    const header = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      }),
    };
    const url = `${this.productServiceURL}stores/${storeID}`;
    return this.http.get(url, header);
  }

  // Ref : https://api.symplified.it/product-service/v1/stores/8913d06f-a63f-4a16-8059-2a30a517663a/discount/active
  getStoreActiveDiscount(storeID) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    const url =
      this.productServiceURL + "stores/" + storeID + "/discount/active";

    return this.http.get(url, header);
  }

  // Ref : https://api.symplified.biz/product-service/v1/stores/McD

  getStoreInfoByID(storeID: string) {
    const header = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer accessToken",
      }),
    };
    const url = this.productServiceURL + "stores/" + storeID;

    return this.http.get(url, header);
  }

  getStoreInfoByDomainName(domainName: string) {
    const header = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      }),
      params: {
        domain: domainName,
      },
    };

    const url = this.productServiceURL + "stores";

    return this.http.get(url, header);
  }

  // Ref : https://api.symplified.biz/order-service/v1/carts/8a4868e2-c5d2-4c7e-8c8f-1547c9736208/discount?deliveryCharge=10.00

  getDiscount(cartId, deliveryCharge) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    const url =
      this.orderServiceURL +
      "carts/" +
      cartId +
      "/discount?deliveryCharge=" +
      deliveryCharge;

    return this.http.get(url, header);
  }

  // REf : https://api.symplified.biz/product-service/v1/region-country-state?id=MYS
  getStateByCountryID(countryID) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    const url =
      this.productServiceURL +
      "region-country-state?regionCountryId=" +
      countryID;

    return this.http.get(url, header);
  }

  // https://api.symplified.biz/product-service/v1/stores/8913d06f-a63f-4a16-8059-2a30a517663a/products?pageSize=10&page=0&status=ACTIVE
  getProductSByStoreID(storeID) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    const url =
      this.productServiceURL +
      "stores/" +
      storeID +
      "/products?pageSize=10" +
      "&page=0" +
      "&status=ACTIVE";

    return this.http.get(url, header);
  }

  getStoreHoursByID(storeID) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    const url = this.productServiceURL + "stores/" + storeID;

    return this.http.get(url, header);
  }

  // Ref : http://209.58.160.20:7071/swagger-ui.html#/store-controller/getStoreUsingGET_1
  getStoreInfo(storename) {
    const header = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer accessToken",
      }),
    };
    const url = this.productServiceURL + "stores/" + storename;

    return this.http.get(url, header);
  }

  // Ref : http://209.58.160.20:7071/swagger-ui.html#/product-controller/getProductUsingGET
  getProductByProductID(productID) {
    const header = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer accessToken",
      }),
    };
    const url =
      this.productServiceURL +
      "products/" +
      productID +
      "?featured=true" +
      "&page=0" +
      "&pageSize=20";

    return this.http.get(url, header);
  }
  getCategoryByStoreID(storeID): Observable<Category[]> {
    const header = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer accessToken",
      }),
    };
    const url =
      this.productServiceURL +
      "store-categories?page=0" +
      "&pageSize=20" +
      "&storeId=" +
      storeID;
    return this.http.get<Category[]>(url, header);
  }
  // Ref : https://api.symplified.biz/product-service/v1/stores/8913d06f-a63f-4a16-8059-2a30a517663a/deliverydetails
  getDeliveryOption(storeID) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    const url =
      this.productServiceURL + "stores/" + storeID + "/deliverydetails";
    return this.http.get(url, header);
  }

  // Ref : http://209.58.160.20:7071/swagger-ui.html#/product-controller/getProductUsingGET_1

  // https://api.symplified.biz/product-service/v1/stores/b91e95f5-4af5-40ff-b7d2-d90b67eb595b/
  // products?pageSize=10&page=0&status=ACTIVE&categoryId=ad3e14db-54c8-4595-ba57-ee6c450bab99
  getProductSByCategory(categoryId, storeID, sortId, pageNo) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };

    // Endpoint: http://localhost:7071/stores/storeId/products?sortByCol=price&sortingOrder=DESC

    let url = "";
    if (categoryId != null) {
      if (sortId == 1) {
        // cheapest
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&categoryId=" +
          categoryId +
          "&sortByCol=price" +
          "&sortingOrder=ASC";
      } else if (sortId == 2) {
        // expensive
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&categoryId=" +
          categoryId +
          "&sortByCol=price" +
          "&sortingOrder=DESC";
      } else if (sortId == 3) {
        // by A-Z
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&categoryId=" +
          categoryId +
          "&sortingOrder=ASC";
      } else if (sortId == 4) {
        // by Z-A
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&categoryId=" +
          categoryId +
          "&sortingOrder=DESC";
      } else if (sortId == 5) {
        // by Most Recent
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&categoryId=" +
          categoryId +
          "&sortByCol = created" +
          "&sortingOrder=DESC";
      } else {
        // non sorted
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&categoryId=" +
          categoryId +
          "&page=" +
          pageNo;
      }
    } else {
      if (sortId == 1) {
        // cheapest
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&sortByCol=price" +
          "&sortingOrder=ASC";
      } else if (sortId == 2) {
        // expensive
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&sortByCol=price" +
          "&sortingOrder=DESC";
      } else if (sortId == 3) {
        // by A-Z
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&sortingOrder=ASC";
      } else if (sortId == 4) {
        // by Z-A
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&sortingOrder=DESC";
      } else if (sortId == 5) {
        // by Most Recent
        url =
          "stores/" +
          storeID +
          "/products?status=ACTIVE" +
          "&page=" +
          pageNo +
          "&sortByCol = created" +
          "&sortingOrder=DESC";
      } else {
        // non sorted
        url =
          "stores/" + storeID + "/products?status=ACTIVE" + "&page=" + pageNo;
      }
    }

    return this.http.get(this.productServiceURL + url, header);
  }

  // Ref : http://209.58.160.20:7071/swagger-ui.html#/store-product-controller/getStoreProductsUsingGET
  getProductsByName(name, store_id) {
    const header = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer accessToken",
      }),
    };

    const url =
      this.productServiceURL +
      "stores/" +
      store_id +
      "/products?featured=true" +
      "&page=0" +
      "&pageSize=20" +
      "&seoName=" +
      name;

    return this.http.get(url, header);
  }

  // Ref : http://209.58.160.20:7071/swagger-ui.html#/store-product-inventory-controller/getStoreProductInventorysUsingGET
  getUpdatedByVariant(storeId, productId, variantArr) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };

    this.variantStr = "";

    variantArr.forEach((variant) => {
      if (variant.variantID === variantArr[variantArr.length - 1].variantID) {
        this.variantStr += "variantIds=" + variant.variantID;
      } else {
        this.variantStr += "variantIds=" + variant.variantID + "&";
      }
    });

    const url = this.productServiceURL;
    "stores/" +
      storeId +
      "/products/" +
      productId +
      "/inventory?" +
      this.variantStr;

    return this.http.get(url, header);
  }

  // ===============
  // order service
  // ===============

  // Ref : http://209.58.160.20:7072/swagger-ui.html#/cart-controller/getCartsUsingGET
  getCartList(customerID, storeID) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    // http://209.58.160.20:7072/carts?customerId=4&page=0&pageSize=20
    const url =
      this.orderServiceURL +
      "carts?customerId=" +
      customerID +
      "&page=0" +
      "&pageSize=20" +
      "&storeId=" +
      storeID;

    return this.http.get(url, header);
  }

  // Ref : http://209.58.160.20:7072/swagger-ui.html#/order-controller/getOrdersUsingGET
  getOrderId(customerID, storeID) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    // http://209.58.160.20:7072/orders?customerId=4&page=0&pageSize=20&storeId=b0c5d5bf-be25-465c-811a-44c20011d025
    const url =
      this.orderServiceURL +
      "orders?customerId=" +
      customerID +
      "&page=0" +
      "&pageSize=20" +
      "&storeId=" +
      storeID;

    return this.http.get(url, header);
  }

  // Ref : http://209.58.160.20:7072/swagger-ui.html#/cart-item-controller/getCartItemsUsingGET
  getCartItemByCartID(cartID) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };
    // http://209.58.160.20:7072/carts/3/items?page=0&pageSize=20
    const url =
      this.orderServiceURL +
      "carts/" +
      cartID +
      "/items?page=0" +
      "&pageSize=200";

    return this.http.get(url, header);
  }

  // Ref : https://api.symplified.biz/order-service/v1/orders/000e0d1a-ed1a-4741-8a55-d5e598421364
  getOrdersByID(order_id) {
    const header = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`),
    };

    const url = this.orderServiceURL + "orders/" + order_id;

    return this.http.get(url, header);
  }

  // Ref : http://209.58.160.20:7072/swagger-ui.html#/cart-item-controller/postCartItemsUsingPOST
  postAddToCart(data): Observable<any> {
    // data sample : { "cartId": "string", "id": "string", "itemCode": "string", "price": 0, "productId": "string", "productPrice": 0, "quantity": 0, "sku": "string", "weight": 0}
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
    };

    const url = this.orderServiceURL + "carts/" + data.cartId + "/items";

    return this.http.post(url, data, httpOptions);
  }

  // Ref : http://209.58.160.20:7072/swagger-ui.html#/order-item-controller/postOrderItemsUsingPOST
  postAddItemToOrder(data): Observable<any> {
    // data sample : { "id": "string", "itemCode": "string", "orderId": "string", "price": 0, "productId": "string", "productPrice": 0, "quantity": 0, "sku": "string", "weight": 0}
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
    };

    const url = this.orderServiceURL + "orders/" + data.orderId + "/items";

    return this.http.post(url, data, httpOptions);
  }

  // ref : http://209.58.160.20:7001/orders/placeOrder?cartId=0439aee0-b57f-4cf5-81c4-f93d6103c57f
  postConfirmCOD(data, cartId, saveInfo): Observable<any> {
    // data sample : { "created": "2021-05-26T01:59:19.698Z", "customerId": "string", "id": "string", "isOpen": true, "storeId": "string", "updated": "2021-05-26T01:59:19.699Z"}
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
    };

    // const url = "http://209.58.160.20:7001/orders/placeOrder?cartId=" + cartId;
    const url =
      this.orderServiceURL +
      "orders/placeOrder?cartId=" +
      cartId +
      "&saveCustomerInformation=" +
      saveInfo;
    return this.http.post(url, data, httpOptions);
  }

  // ref : http://209.58.160.20:7072/swagger-ui.html#/cart-controller/postCartsUsingPOST
  postCreateCart(data): Observable<any> {
    // data sample : { "created": "2021-05-26T01:59:19.698Z", "customerId": "string", "id": "string", "isOpen": true, "storeId": "string", "updated": "2021-05-26T01:59:19.699Z"}
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
    };

    const url = this.orderServiceURL + "carts";
    return this.http.post(url, data, httpOptions);
  }

  // ref : http://209.58.160.20:7072/swagger-ui.html#/order-controller/postOrdersUsingPOST
  postInitOrder(data, isSaved): Observable<any> {
    // data : { "cartId": "string", "completionStatus": "string", "customerId": "string", "customerNotes": "string", "deliveryAddress": "string", "deliveryCity": "string", "deliveryContactName": "string", "deliveryContactPhone": "string", "deliveryCountry": "string", "deliveryEmail": "string", "deliveryPostcode": "string", "deliveryProviderId": 0, "deliveryState": "string", "paymentStatus": "string", "privateAdminNotes": "string", "storeId": "string", "subTotal": 0, "total": 0}
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
    };
    // "https://api.symplified.biz/order-service/v1/",
    const url =
      this.orderServiceURL + "orders?saveCustomerInformation=" + isSaved;
    return this.http.post(url, data, httpOptions);
  }

  // ref : http://209.58.160.20:7072/swagger-ui.html#/order-controller/postOrdersUsingPOST
  putUpdateOrderStatus(data): Observable<any> {
    // data : { "cartId": "string", "completionStatus": "string", "customerId": "string", "customerNotes": "string", "deliveryAddress": "string", "deliveryCity": "string", "deliveryContactName": "string", "deliveryContactPhone": "string", "deliveryCountry": "string", "deliveryEmail": "string", "deliveryPostcode": "string", "deliveryProviderId": 0, "deliveryState": "string", "paymentStatus": "string", "privateAdminNotes": "string", "storeId": "string", "subTotal": 0, "total": 0}
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
    };

    const url = this.orderServiceURL + "orders";
    return this.http.post(url, data, httpOptions);
  }

  // ref : http://209.58.160.20:7072/swagger-ui.html#/cart-item-controller/deleteCartItemsByIdUsingDELETE
  deleteCartItemID(data, id): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
      body: data,
    };

    const url = this.orderServiceURL + "carts/" + data.cartId + "/items/" + id;

    return this.http.delete(url, httpOptions);
  }

  // ref : http://209.58.160.20:7072/swagger-ui.html#/cart-item-controller/putCartItemsByIdUsingPUT
  putCartItem(data): Observable<any> {
    // data sample : { "cartId": "string", "itemId": "string", "operation": "string" }
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
    };

    const url =
      this.orderServiceURL + "carts/" + data.cartId + "/items/" + data.id;

    return this.http.put(url, data, httpOptions);
  }

  // ref : http://209.58.160.20:7072/swagger-ui.html#/cart-item-controller/updateQuantityCartItemsByIdUsingPOST
  updateCartItem(data): Observable<any> {
    // data sample : { "cartId": "string", "itemId": "string", "operation": "string" }
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
    };

    const url =
      this.orderServiceURL +
      "carts/" +
      data.cartId +
      "/items/updatequantiy/" +
      data.id +
      "/" +
      data.quantityChange;

    return this.http.post(url, data, httpOptions);
  }

  // ref : http://209.58.160.20:7072/swagger-ui.html#/cart-item-controller/deleteCartItemsByIdUsingDELETE
  deleteAllCartItem(data): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      }),
      body: data,
    };

    const url = this.orderServiceURL + "carts/" + data.cartId + "/items/clear";

    return this.http.delete(url, httpOptions);
  }

  // ===============
  // delivery service
  // ===============

  // ref : http://209.58.160.20:5000/swagger-ui.html#/orders-controller/getPriceUsingPOST
  postTogetDeliveryFee(xxx): Observable<any> {
    // data : { "customerId": "string", "delivery": { "deliveryAddress": "string", "deliveryCity": "string", "deliveryContactEmail": "string", "deliveryContactName": "string", "deliveryContactPhone": "string", "deliveryCountry": "string", "deliveryPostcode": "string", "deliveryState": "string" }, "deliveryProviderId": 0, "insurance": true, "itemType": "parcel", "merchantId": 0, "orderId": "string", "pickup": { "parcelReadyTime": "string", "pickupAddress": "string", "pickupCity": "string", "pickupContactEmail": "string", "pickupContactName": "string", "pickupContactPhone": "string", "pickupCountry": "string", "pickupDate": "string", "pickupLocationId": 0, "pickupOption": "string", "pickupPostcode": "string", "pickupState": "string", "pickupTime": "string", "remarks": "string", "trolleyRequired": true, "vehicleType": "CAR" }, "pieces": 0, "productCode": "string", "shipmentContent": "string", "shipmentValue": 0, "storeId": "string", "totalWeightKg": 0, "transactionId": "string"}
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.tokenPay}`,
        "Content-Type": "application/json",
      }),
    };

    const url = this.deliveryServiceURL + "orders/getprice";

    return this.http.post(url, xxx, httpOptions);
    // return this.http.get(this.payServiceURL + "payments/makePayment", httpOptions);
  }

  // ref : http://209.58.160.20:5000/swagger-ui.html#/orders-controller/submitOrderUsingPOST
  postSubmitDeliveryOrder(data): Observable<any> {
    // data : { "customerId": "string", "delivery": { "deliveryAddress": "string", "deliveryCity": "string", "deliveryContactEmail": "string", "deliveryContactName": "string", "deliveryContactPhone": "string", "deliveryCountry": "string", "deliveryPostcode": "string", "deliveryState": "string" }, "deliveryProviderId": 0, "insurance": true, "itemType": "parcel", "merchantId": 0, "orderId": "string", "pickup": { "parcelReadyTime": "string", "pickupAddress": "string", "pickupCity": "string", "pickupContactEmail": "string", "pickupContactName": "string", "pickupContactPhone": "string", "pickupCountry": "string", "pickupDate": "string", "pickupLocationId": 0, "pickupOption": "string", "pickupPostcode": "string", "pickupState": "string", "pickupTime": "string", "remarks": "string", "trolleyRequired": true, "vehicleType": "CAR" }, "pieces": 0, "productCode": "string", "shipmentContent": "string", "shipmentValue": 0, "storeId": "string", "totalWeightKg": 0, "transactionId": "string"}
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.tokenPay}`,
        "Content-Type": "application/json",
      }),
    };

    const url = this.deliveryServiceURL + "orders/submitorder";

    return this.http.post(url, data, httpOptions);
    // return this.http.get(this.payServiceURL + "payments/makePayment", httpOptions);
  }

  // ===============
  // pay service
  // ===============

  // ref : http://209.58.160.20:6001/swagger-ui.html#/payments-controller/makePaymentUsingPOST
  postPaymentLink(data): Observable<any> {
    // data : { "callbackUrl": "string", "customerId": 0, "customerName": "string", "paymentAmount": 0, "productCode": "string", "systemTransactionId": "string", "transactionId": "string"}
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.tokenPay}`,
        "Content-Type": "application/json",
      }),
    };

    const url = this.payServiceURL + "payments/makePayment";

    return this.http.post(url, data, httpOptions);
    // return this.http.get(this.payServiceURL + "payments/makePayment", httpOptions);
  }
}
