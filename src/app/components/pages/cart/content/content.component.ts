import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/api.service";
import { CartService } from "src/app/cart.service";
import { CartItem } from "src/app/components/models/cart";
import { Product } from "src/app/components/models/product";
import cartList from "../../../../data/cart.json";
import shoppost from "../../../../data/shop.json";
import Swal from "sweetalert2";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"],
})
export class ContentComponent implements OnInit {
  cart: CartItem[];
  product: Product[];
  closeResult: string;
  modalContent: CartItem;

  orderDiscount: number = 0;
  takeAwayFee: number = 0;
  deliveryCharges: number = 0;
  deliveryDiscount: number = 0;

  constructor(
    private modalService: NgbModal,
    private cartService: CartService,
    private storeService: StoreService,
    private apiService: ApiService
  ) {}
  open(content: any, item: CartItem) {
    this.modalContent = item;
    this.modalService.open(content, {
      centered: true,
      size: "lg",
      windowClass: "andro_quick-view-modal p-0",
    });
  }
  // Increment decrement
  increment() {
    this.modalContent.quantity += 1;
  }
  decrement() {
    if (this.modalContent.quantity > 1) {
      this.modalContent.quantity -= 1;
    }
  }
  public shopbox: { img: string }[] = shoppost;
  public calculateSubtotal() {
    return this.cart.reduce(
      (subtotal: number, item: CartItem) => subtotal + item.price,
      0
    );
  }
  public calculateGrandTotal() {
    const subtotal = this.calculateSubtotal();
    return (
      subtotal -
      this.orderDiscount +
      (this.takeAwayFee / 100) * subtotal +
      this.deliveryCharges -
      this.deliveryDiscount
    );
  }
  upsellConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    autoplay: true,
    prevArrow: ".andro_upsells .slider-prev",
    nextArrow: ".andro_upsells .slider-next",
  };

  ngOnInit(): void {
    this.cart = this.cartService.cart;
    this.cartService.cartChange.subscribe((cart) => {
      this.cart = cart;
      
    });
    this.getFeaturedProducts();
    console.log('cart',this.cartService)
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  async getFeaturedProducts() {
    this.product = await this.storeService.getStoreProducts();
  }

  async updateCartItem(cartItem: CartItem) {
    this.modalService.dismissAll();
    const putResult: any = await this.cartService.putCartItem(
      this.modalContent
    );
    if (putResult.status === 202) {
      // Show success message
      Swal.fire({
        toast: true,
        title: "Item updated",
        icon: "success",

        showConfirmButton: false,
        position: "bottom-end",
        timer: 2000,
        width: "20%",

        padding: "0.75rem",
      });
    } else {
      // Show failure message
      Swal.fire({
        toast: true,
        icon: "error",
        text: "Something is wrong",
        timer: 2000,
        padding: "0.75rem",
      });
    }
  }

  async deleteCartItem(cartItem: CartItem, index: number) {
    const deleteResult: any = await this.cartService.deleteCartItem(
      cartItem,
      index
    );
    Swal.fire({
      toast: true,
      icon: "success",
      title: "Item deleted",
      showConfirmButton: false,
      position: "bottom-end",
      width: "20%",
      timer: 2000,
      padding: "0.75rem",
    });
    if (deleteResult.status !== 200) {
      // Show failure message
      Swal.fire({
        toast: true,
        icon: "error",
        text: "Item is still here",
        showConfirmButton: false,
        width: "20%",
        timer: 2000,
        padding: "0.75rem",
      });
    }
  }
}
